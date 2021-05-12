import * as Inputs from "@observablehq/inputs";
import {html} from "htl";

export async function range() {
  return Inputs.range();
}

export async function range100() {
  return Inputs.range([0, 100], {step: 1, value: 20});
}

export async function rangeFixed() {
  return Inputs.range([0, 1], {value: 0.12345, format: x => x.toFixed(3)});
}

export async function rangeLabel() {
  return Inputs.range([0, 1], {label: "dollars&pounds"});
}

export async function rangeLabelHtml() {
  return Inputs.range([0, 1], {label: html`<b>intensity</b>`});
}

export async function rangeWide() {
  return Inputs.range([0, 1], {width: "20em"});
}

export async function rangePlaceholder() {
  return Inputs.range([0, 1], {placeholder: "number"});
}
