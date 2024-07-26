import * as Inputs from "../../src/index.js";
import {html} from "htl";

export async function radio() {
  return Inputs.radio(["red", "green", "blue"]);
}

export async function radioFormat() {
  return Inputs.radio(["red", "green", "blue"], {format: x => x.toUpperCase()});
}

export async function radioLabel() {
  return Inputs.radio(["red", "green", "blue"], {label: "dollars&pounds"});
}

export async function radioLabelHtml() {
  return Inputs.radio(["red", "green", "blue"], {label: html`<b>color</b>`});
}

export async function radioMap() {
  return Inputs.radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]));
}

export async function radioMapFormat() {
  return Inputs.radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {format: ([key, value]) => `${key} (${value})`});
}

export async function radioMapKey() {
  return Inputs.radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {key: "green"});
}

export async function radioMapValue() {
  return Inputs.radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {value: "#0f0"});
}

export async function radioUnique() {
  return Inputs.radio(["red", "red", "green", "Green", "blue", "blue"], {unique: true});
}

export async function radioUniqueFormat() {
  return Inputs.radio(["red", "Red", "green", "Green", "blue", "Blue"], {format: x => x.toLowerCase(), unique: true});
}

export async function radioSortTrue() {
  return Inputs.radio([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: true});
}

export async function radioSortFalse() {
  return Inputs.radio([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: false});
}

export async function radioSortAscending() {
  return Inputs.radio([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "ascending"});
}

export async function radioSortDescending() {
  return Inputs.radio([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "descending"});
}

export async function radioSortFunction() {
  return Inputs.radio([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: (a, b) => a < b ? -1 : a > b ? 1 : 0});
}

export async function radioSortFormat() {
  return Inputs.radio([..."CXQZaLORbNHtmjDVFGWsKeupyI"], {format: x => x.toLowerCase(), sort: true});
}

export async function radioValue() {
  return Inputs.radio(["red", "green", "blue"], {value: "green"});
}

export async function radioDisabled() {
  return Inputs.radio(["red", "green", "blue"], {disabled: true});
}

export async function radioDisabledSome() {
  return Inputs.radio(["red", "green", "blue"], {disabled: ["green"]});
}
