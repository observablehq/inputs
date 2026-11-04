import * as Inputs from "../../src/index.js";

export async function file() {
  return Inputs.file();
}

export async function fileLabel() {
  return Inputs.file({label: "dollars&pounds"});
}

export async function fileWide() {
  return Inputs.file({width: "20em"});
}
