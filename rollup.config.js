import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import RollupNode from "@rollup/plugin-node-resolve";
import RollupReplace from "@rollup/plugin-replace";
import RollupTerser from "@rollup/plugin-terser";
import RollupJson from "@rollup/plugin-json";
import jsesc from "jsesc";
import CleanCSS from "clean-css";
import meta from "./package.json" with {type: "json"};

const filename = meta.name.split("/").pop();

// Extract copyrights from the LICENSE.
const copyright = readFileSync("./LICENSE", "utf-8")
  .split(/\n/g)
  .filter((line) => /^copyright\s+/i.test(line))
  .map((line) => line.replace(/^copyright\s+/i, ""))
  .join(", ");

const banner = `// ${meta.name} v${meta.version} Copyright ${copyright}`;

// A unique namespace for our styles.
const styleNs = "inputs-3a86ea";
const stylePath = resolve("./src/style.css");

// A lil’ Rollup plugin to allow importing of style.css.
const css = {
  load(id) {
    if (id !== stylePath) return;
    return readFileSync(id, "utf8");
  },
  transform(input, id) {
    if (id !== stylePath) return;
    return {
      moduleSideEffects: true,
      code: `if (typeof document !== 'undefined' && !document.querySelector('.${styleNs}')) {
const style = document.createElement('style');
style.className = '${styleNs}';
style.textContent = '${jsesc(new CleanCSS().minify(input.replace(/\.__ns__\b/g, `.${styleNs}`)).styles)}';
document.head.appendChild(style);
}
`
    };
  }
};

const terser = RollupTerser({output: {preamble: banner}});

function config(options) {
  return {
    input: "src/index.js",
    external: ["htl"],
    ...options,
    output: {
      name: "Inputs",
      indent: false,
      extend: true,
      banner,
      globals: {htl: "htl"},
      ...options.output
    },
    plugins: [
      RollupNode(),
      RollupReplace({__ns__: styleNs, preventAssignment: true}),
      RollupJson(),
      ...(options.plugins ?? [])
    ]
  };
}

export default [
  config({
    output: {
      file: "dist/index.js",
      format: "es"
    }
  }),
  config({
    output: {
      file: "dist/index.min.js",
      format: "es"
    },
    plugins: [terser]
  }),
  config({
    input: "bundle.js",
    output: {
      file: `dist/${filename}.js`,
      format: "umd"
    },
    plugins: [css]
  }),
  config({
    input: "bundle.js",
    output: {
      file: `dist/${filename}.min.js`,
      format: "umd"
    },
    plugins: [css, terser]
  })
];
