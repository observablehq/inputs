import {Select} from "@observablehq/inputs";
import {html} from "htl";

export async function select() {
  return Select(["red", "green", "blue"]);
}

export async function selectFormat() {
  return Select(["red", "green", "blue"], {format: x => x.toUpperCase()});
}

export async function selectLabel() {
  return Select(["red", "green", "blue"], {label: "dollars&pounds"});
}

export async function selectLabelHtml() {
  return Select(["red", "green", "blue"], {label: html`<b>color</b>`});
}

export async function selectMap() {
  return Select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]));
}

export async function selectMapValue() {
  return Select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {value: "#0f0"});
}

export async function selectMultiple() {
  return Select(["red", "green", "blue"], {label: "colors", multiple: true});
}

export async function selectMultipleLong() {
  return Select("ABCDEFGHIJKLMNOPQRSTUVWXYZ", {multiple: true});
}

export async function selectMultipleSize() {
  return Select(["red", "green", "blue"], {label: "colors", multiple: 5});
}

export async function selectValue() {
  return Select(["red", "green", "blue"], {value: "green"});
}

export async function selectWide() {
  return Select(["red", "green", "blue"], {style: {width: "20em"}});
}

export async function selectStyle() {
  return Select(["red", "green", "blue"], {style: {background: "reds"}});
}
