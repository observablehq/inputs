import assert from "node:assert";
import {readFile} from "node:fs/promises";
import {JSDOM} from "jsdom";
import CleanCSS from "clean-css";

it("default styles use zero-specificity selectors, including media rules", async () => {
  const css = await readFile(new URL("../src/style.css", import.meta.url), "utf8");
  for (const styles of [css, new CleanCSS().minify(css).styles]) {
    const {window} = new JSDOM(`<style>${styles}</style>`);
    let count = 0;
    const check = (rules) => {
      for (const rule of rules) {
        if (rule.cssRules) check(rule.cssRules);
        if (!rule.selectorText) continue;
        ++count;
        assert.match(rule.selectorText, /^:where\([^{}]+\)$/);
      }
    };
    check(window.document.styleSheets[0].cssRules);
    assert(count > 30);
    window.close();
  }
});

// jsdom resolves the cascade by source order only, ignoring specificity; that
// matches browsers here because all default styles have zero specificity.
it("toggle checkbox is not stretched to the form width", async () => {
  const css = await readFile(new URL("../src/style.css", import.meta.url), "utf8");
  const {window} = new JSDOM(`<style>${css}</style>
<form class="__ns__ __ns__-toggle"><label>Label</label><input id="toggle" class="__ns__-input" type="checkbox"></form>
<form class="__ns__"><label>Label</label><div id="text" class="__ns__-input"><input type="text"></div></form>`);
  const width = (id) => window.getComputedStyle(window.document.getElementById(id)).width;
  assert.strictEqual(width("text"), "100%");
  assert.notStrictEqual(width("toggle"), "100%");
  window.close();
});
