import * as Inputs from "@observablehq/inputs";

const Inputs_file = Inputs.fileOf(class AbstractFile {});

export async function file() {
  return Inputs_file();
}

export async function fileLabel() {
  return Inputs_file({label: "dollars&pounds"});
}

export async function fileWide() {
  return Inputs_file({width: "20em"});
}
