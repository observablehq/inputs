import * as Inputs from "@observablehq/inputs";

export async function date() {
  return Inputs.date();
}

export async function dateLabel() {
  return Inputs.date({label: "dollars&pounds"});
}

export async function dateValue() {
  return Inputs.date({value: new Date("2021-01-01")});
}
