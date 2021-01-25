import {terser} from "rollup-plugin-terser";
import * as meta from "./package.json";

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

export default [
  {
    ...config,
    output: {
      ...config.output,
      format: "cjs",
      file: `dist/${meta.name}.cjs.js`
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      format: "umd",
      file: `dist/${meta.name}.umd.js`
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      format: "umd",
      file: `dist/${meta.name}.umd.min.js`
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner
        }
      })
    ]
  }
];
