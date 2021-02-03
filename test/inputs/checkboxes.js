import {Checkbox} from "@observablehq/inputs";
import {html} from "htl";

export async function checkbox() {
  return Checkbox(["red", "green", "blue"]);
}

export async function checkboxFormat() {
  return Checkbox(["red", "green", "blue"], {format: x => x.toUpperCase()});
}

export async function checkboxLabel() {
  return Checkbox(["red", "green", "blue"], {label: "dollars&pounds"});
}

export async function checkboxLabelHtml() {
  return Checkbox(["red", "green", "blue"], {label: html`<b>color</b>`});
}

export async function checkboxMap() {
  return Checkbox(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]));
}

export async function checkboxMapFormat() {
  return Checkbox(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {format: ([key, value]) => `${key} (${value})`});
}

export async function checkboxMapKey() {
  return Checkbox(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {key: "green"});
}

export async function checkboxMapValue() {
  return Checkbox(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {value: "#0f0"});
}

export async function checkboxUnique() {
  return Checkbox(["red", "red", "green", "Green", "blue", "blue"], {unique: true});
}

export async function checkboxUniqueFormat() {
  return Checkbox(["red", "Red", "green", "Green", "blue", "Blue"], {format: x => x.toLowerCase(), unique: true});
}

export async function checkboxSortTrue() {
  return Checkbox([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: true});
}

export async function checkboxSortFalse() {
  return Checkbox([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: false});
}

export async function checkboxSortAscending() {
  return Checkbox([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "ascending"});
}

export async function checkboxSortDescending() {
  return Checkbox([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "descending"});
}

export async function checkboxSortFunction() {
  return Checkbox([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: (a, b) => a < b ? -1 : a > b ? 1 : 0});
}

export async function checkboxSortFormat() {
  return Checkbox([..."CXQZaLORbNHtmjDVFGWsKeupyI"], {format: x => x.toLowerCase(), sort: true});
}

export async function checkboxValue() {
  return Checkbox(["red", "green", "blue"], {value: "green"});
}

export async function checkboxDisabled() {
  return Checkbox(["red", "green", "blue"], {disabled: true});
}

export async function checkboxDisabledSome() {
  return Checkbox(["red", "green", "blue"], {disabled: ["green"]});
}
