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
