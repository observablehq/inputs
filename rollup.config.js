import fs from "fs";
import path from "path";
import {terser} from "rollup-plugin-terser";
import node from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import jsesc from "jsesc";
import CleanCSS from "clean-css";
import * as meta from "./package.json";

const filename = meta.name.split("/").pop();

// Resolve HTL dependency.
const htl = JSON.parse(fs.readFileSync("./node_modules/htl/package.json", "utf-8"));
if (typeof htl.jsdelivr === "undefined") throw new Error("unable to resolve htl");
const htlPath = `htl@${htl.version}/${htl.jsdelivr}`;

// Extract copyrights from the LICENSE.
const copyrights = fs.readFileSync("./LICENSE", "utf-8")
  .split(/\n/g)
  .filter(line => /^copyright\s+/i.test(line))
  .map(line => line.replace(/^copyright\s+/i, ""));

// A unique namespace for our styles.
const styleNs = "oi-3a86ea";

const stylePath = path.resolve("./src/style.css");

// A lil’ Rollup plugin to allow importing of style.css.
const css = {
  load(id) {
    if (id !== stylePath) return;
    return fs.readFileSync(id, "utf8");
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

const config = {
  input: "bundle.js",
  external: ["htl"],
  output: {
    indent: false,
    banner: `// ${meta.name} v${meta.version} Copyright ${copyrights.join(", ")}`,
    name: "Inputs",
    format: "umd",
    extend: true,
    globals: {"htl": "htl"},
    paths: {"htl": htlPath}
  },
  plugins: [
    css,
    json(),
    node(),
    replace({__ns__: styleNs, preventAssignment: true})
  ]
};

export default [
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${filename}.js`
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${filename}.min.js`
    },
    plugins: [
      ...config.plugins,
      terser({output: {preamble: config.output.banner}})
    ]
  },
  {
    input: "src/index.js",
    external: ["htl", "isoformat"],
    output: {
      indent: false,
      banner: `// ${meta.name} v${meta.version} Copyright ${copyrights.join(", ")}`,
      format: "es",
      file: "dist/index.js"
    },
    plugins: [
      node(),
      replace({__ns__: styleNs, preventAssignment: true})
    ]
  }
];
