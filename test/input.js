import assert from "assert";
import {promises as fs} from "fs";
import * as path from "path";
import beautify from "js-beautify";
import it from "./jsdom.js";
import * as inputs from "./inputs/index.js";

(async () => {
  for (const [name, input] of Object.entries(inputs)) {
    it(`input ${name}`, async () => {
      const reid = new Map();
      const element = await input();
      const actual = beautify.html(
        element.outerHTML
          .replace(/(?<=="[^"]*)\b__ns__-([0-9]+)\b/g, (_, id) => `__ns__-${reid.has(id) ? reid.get(id) : (reid.set(id, id = reid.size + 1), id)}`)
          .replace(/(?<=="[^"]*)\b__ns__\b/g, `__ns__`),
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
      assert(actual === expected, `${name} must match snapshot`);
    });
  }
})();
