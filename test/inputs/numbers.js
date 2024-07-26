import * as Inputs from "../../src/index.js";
import {html} from "htl";

export async function number() {
  return Inputs.number();
}

export async function number100() {
  return Inputs.number([0, 100], {step: 1, value: 20});
}

export async function numberFixed() {
  return Inputs.number([0, 1], {value: 0.12345, format: x => x.toFixed(3)});
}

export async function numberLabel() {
  return Inputs.number([0, 1], {label: "dollars&pounds"});
}

export async function numberLabelHtml() {
  return Inputs.number([0, 1], {label: html`<b>intensity</b>`});
}

export async function numberWide() {
  return Inputs.number([0, 1], {width: "20em"});
}

export async function numberPlaceholder() {
  return Inputs.number([0, 1], {placeholder: "number"});
}
