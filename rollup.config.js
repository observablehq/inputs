import {terser} from "rollup-plugin-terser";
import * as meta from "./package.json";

const filename = meta.name.split("/").pop();

const config = {
  input: "src/index.js",
  external: ["htl"],
  output: {
    indent: false,
    banner: `// ${meta.name} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author.name}`,
    name: "observablehq",
    extend: true,
    globals: {"htl": "htl"},
    paths: {"htl": `htl@${meta.dependencies.htl}`}
  },
  plugins: []
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
      file: `dist/${filename}.umd.js`
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      format: "umd",
      file: `dist/${filename}.umd.min.js`
    },
    plugins: [
      ...config.plugins,
      minify
    ]
  }
];
