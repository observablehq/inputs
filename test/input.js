import {promises as fs} from "fs";
import * as path from "path";
import {html as beautify} from "js-beautify";
import tape from "tape-await";
import * as inputs from "./inputs/index.js";
import {withJsdom} from "./jsdom.js";

(async () => {
  for (const [name, input] of Object.entries(inputs)) {
    tape(`input ${name}`, async test => {
      const reid = new Map();
      const element = await withJsdom(input);
      const actual = beautify(
        element.outerHTML
          .replace(/(?<=="[^"]*)\boi-[a-f0-9]{6}-([0-9]+)\b/g, (_, id) => `__ns__-${reid.has(id) ? reid.get(id) : (reid.set(id, id = reid.size + 1), id)}`)
          .replace(/(?<=="[^"]*)\boi-[a-f0-9]{6}\b/g, `__ns__`),
        {indent_size: 2}
      );
      const outfile = path.resolve("./test/output", path.basename(name, ".js") + ".html");
      let expected;
      try {
        expected = await fs.readFile(outfile, "utf8");
      } catch (error) {
        if (error.code === "ENOENT" && process.env.CI !== "true") {
          console.warn(`! generating ${outfile}`);
          await fs.writeFile(outfile, actual, "utf8");
          return;
        } else {
          throw error;
        }
      }
      test.ok(actual === expected, `${name} must match snapshot`);
    });
  }
})();
