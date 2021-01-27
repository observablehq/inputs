import {Range} from "@observablehq/inputs";
import {html} from "htl";

export async function range() {
  return Range();
}

export async function range100() {
  return Range([0, 100], {step: 1, value: 20});
}

export async function rangeFixed() {
  return Range([0, 1], {value: 0.12345, format: x => x.toFixed(3)});
}

export async function rangeLabel() {
  return Range([0, 1], {label: "dollars&pounds"});
}

export async function rangeLabelHtml() {
  return Range([0, 1], {label: html`<b>intensity</b>`});
}

export async function rangeWide() {
  return Range([0, 1], {style: {width: "20em"}});
}

export async function rangeStyle() {
  return Range([0, 1], {style: {background: "red"}});
}
