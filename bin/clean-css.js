import {stdin} from "node:process";
import CleanCSS from "clean-css";

stdin.setEncoding("utf-8");

let input = "";

for await (const chunk of stdin) {
  input += chunk;
}

// A unique namespace for our styles.
const styleNs = "inputs-3a86ea";

process.stdout.write(new CleanCSS().minify(input.replace(/\.__ns__\b/g, `.${styleNs}`)).styles);
