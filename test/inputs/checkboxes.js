import * as Inputs from "../../src/index.js";
import {html} from "htl";

export async function checkbox() {
  return Inputs.checkbox(["red", "green", "blue"]);
}

export async function checkboxFormat() {
  return Inputs.checkbox(["red", "green", "blue"], {format: x => x.toUpperCase()});
}

export async function checkboxLabel() {
  return Inputs.checkbox(["red", "green", "blue"], {label: "dollars&pounds"});
}

export async function checkboxLabelHtml() {
  return Inputs.checkbox(["red", "green", "blue"], {label: html`<b>color</b>`});
}

export async function checkboxMap() {
  return Inputs.checkbox(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]));
}

export async function checkboxMapFormat() {
  return Inputs.checkbox(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {format: ([key, value]) => `${key} (${value})`});
}

export async function checkboxMapKey() {
  return Inputs.checkbox(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {key: "green"});
}

export async function checkboxMapValue() {
  return Inputs.checkbox(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {value: "#0f0"});
}

export async function checkboxUnique() {
  return Inputs.checkbox(["red", "red", "green", "Green", "blue", "blue"], {unique: true});
}

export async function checkboxUniqueFormat() {
  return Inputs.checkbox(["red", "Red", "green", "Green", "blue", "Blue"], {format: x => x.toLowerCase(), unique: true});
}

export async function checkboxSortTrue() {
  return Inputs.checkbox([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: true});
}

export async function checkboxSortFalse() {
  return Inputs.checkbox([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: false});
}

export async function checkboxSortAscending() {
  return Inputs.checkbox([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "ascending"});
}

export async function checkboxSortDescending() {
  return Inputs.checkbox([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "descending"});
}

export async function checkboxSortFunction() {
  return Inputs.checkbox([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: (a, b) => a < b ? -1 : a > b ? 1 : 0});
}

export async function checkboxSortFormat() {
  return Inputs.checkbox([..."CXQZaLORbNHtmjDVFGWsKeupyI"], {format: x => x.toLowerCase(), sort: true});
}

export async function checkboxValue() {
  return Inputs.checkbox(["red", "green", "blue"], {value: "green"});
}

export async function checkboxDisabled() {
  return Inputs.checkbox(["red", "green", "blue"], {disabled: true});
}

export async function checkboxDisabledSome() {
  return Inputs.checkbox(["red", "green", "blue"], {disabled: ["green"]});
}
