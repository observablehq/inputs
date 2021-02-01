import crypto from "crypto";
import fs from "fs";
import path from "path";
import replace from "@rollup/plugin-replace";
import {terser} from "rollup-plugin-terser";
import jsesc from "jsesc";
import CleanCSS from "clean-css";
import * as meta from "./package.json";

const filename = meta.name.split("/").pop();

// Create a content-hashed namespace for our styles.
const stylePath = path.resolve("./src/style.css");
const styleHash = crypto.createHash("sha256").update(fs.readFileSync(stylePath, "utf8")).digest("hex").slice(0, 6);
const styleNs = `oi-${styleHash}`;

// A lil’ Rollup plugin to allow importing of style.css.
const css = {
  load(id) {
    if (id !== stylePath) return;
    return fs.readFileSync(id, "utf8");
  },
  transform(input, id) {
    if (id !== stylePath) return;
    return {
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
  input: "src/index.js",
  external: ["htl"],
  output: {
    indent: false,
    banner: `// ${meta.name} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author.name}`,
    name: "observablehq",
    extend: true,
    globals: {"htl": "htl"}
  },
  plugins: [
    css,
    replace({__ns__: styleNs})
  ]
};

const minify = terser({
  output: {
    preamble: config.output.banner
  }
});

export default [
  {
    ...config,
    output: {
      ...config.output,
      format: "es",
      file: `dist/${filename}.js`,
      paths: {"htl": `https://cdn.jsdelivr.net/npm/htl@${require("htl/package.json").version}/src/index.js`}
    },
    plugins: [
      ...config.plugins,
      minify
    ]
  },
  {
    ...config,
    output: {
      ...config.output,
      format: "cjs",
      file: `dist/${filename}.cjs.js`
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      format: "umd",
      file: `dist/${filename}.umd.js`,
      paths: {"htl": `htl@${meta.dependencies.htl}`}
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      format: "umd",
      file: `dist/${filename}.umd.min.js`,
      paths: {"htl": `htl@${meta.dependencies.htl}`}
    },
    plugins: [
      ...config.plugins,
      minify
    ]
  }
];
