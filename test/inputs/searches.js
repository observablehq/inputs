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

export async function searchLabelQuery() {
  return Search(["red", "green", "blue", "black"], {label: "colors", query: "bl"});
}

export async function searchPlaceholder() {
  return Search(["red", "green", "blue"], {placeholder: "dollars&pounds"});
}

export async function searchFormat() {
  return Search(["red", "green", "blue", "black"], {query: "b", format: x => x > 1 ? ">1" : x + ""});
}

export async function searchSpellcheck() {
  return Search(["red", "green", "blue"], {spellcheck: false});
}

export async function searchStyle() {
  return Search(["red", "green", "blue"], {style: {background: "red"}});
}

export async function searchQuery() {
  return Search(["red", "green", "blue", "black"], {query: "bl"});
}

export async function searchWide() {
  return Search(["red", "green", "blue"], {style: {width: "20em"}});
}
