import {Search} from "@observablehq/inputs";
import {html} from "htl";

export async function search() {
  return Search(["red", "green", "blue"]);
}

export async function searchLabel() {
  return Search(["red", "green", "blue"], {label: "dollars&pounds"});
}

export async function searchLabelHtml() {
  return Search(["red", "green", "blue"], {label: html`<b>color</b>`});
}

export async function searchLabelValue() {
  return Search(["red", "green", "blue", "black"], {label: "colors", value: "bl"});
}

export async function searchPlaceholder() {
  return Search(["red", "green", "blue"], {placeholder: "dollars&pounds"});
}

export async function searchFormat() {
  return Search(["red", "green", "blue", "black"], {value: "b", format: x => x > 1 ? ">1" : x + ""});
}

export async function searchSpellcheck() {
  return Search(["red", "green", "blue"], {spellcheck: false});
}

export async function searchStyle() {
  return Search(["red", "green", "blue"], {style: {background: "red"}});
}

export async function searchValue() {
  return Search(["red", "green", "blue", "black"], {value: "bl"});
}

export async function searchWide() {
  return Search(["red", "green", "blue"], {style: {width: "20em"}});
}
