import * as Inputs from "@observablehq/inputs";
import {html} from "htl";

export async function search() {
  return Inputs.search(["red", "green", "blue"]);
}

export async function searchLabel() {
  return Inputs.search(["red", "green", "blue"], {label: "dollars&pounds"});
}

export async function searchLabelHtml() {
  return Inputs.search(["red", "green", "blue"], {label: html`<b>color</b>`});
}

export async function searchLabelQuery() {
  return Inputs.search(["red", "green", "blue", "black"], {label: "colors", query: "bl"});
}

export async function searchLabelQueryCyrillic() {
  return Inputs.search(["red", "green", "blue", "чёрный"], {label: "colors", query: "чёрн"});
}

export async function searchPlaceholder() {
  return Inputs.search(["red", "green", "blue"], {placeholder: "dollars&pounds"});
}

export async function searchFormat() {
  return Inputs.search(["red", "green", "blue", "black"], {query: "b", format: x => `${x > 1 ? ">1" : x} results`});
}

export async function searchSpellcheck() {
  return Inputs.search(["red", "green", "blue"], {spellcheck: false});
}

export async function searchQuery() {
  return Inputs.search(["red", "green", "blue", "black"], {query: "bl"});
}

export async function searchWide() {
  return Inputs.search(["red", "green", "blue"], {width: "20em"});
}

export async function searchDatalist() {
  return Inputs.search(["red", "green", "blue"], {datalist: ["red", "green", "blue"]});
}

export async function searchDisabled() {
  return Inputs.search(["red", "green", "blue"], {disabled: true});
}
