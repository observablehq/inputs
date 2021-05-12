import * as Inputs from "@observablehq/inputs";
import {html} from "htl";

export async function select() {
  return Inputs.select(["red", "green", "blue"]);
}

export async function selectFormat() {
  return Inputs.select(["red", "green", "blue"], {format: x => x.toUpperCase()});
}

export async function selectLabel() {
  return Inputs.select(["red", "green", "blue"], {label: "dollars&pounds"});
}

export async function selectLabelHtml() {
  return Inputs.select(["red", "green", "blue"], {label: html`<b>color</b>`});
}

export async function selectMap() {
  return Inputs.select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]));
}

export async function selectMapFormat() {
  return Inputs.select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {format: ([key, value]) => `${key} (${value})`});
}

export async function selectMapKey() {
  return Inputs.select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {key: "green"});
}

export async function selectMapValue() {
  return Inputs.select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {value: "#0f0"});
}

export async function selectMultiple() {
  return Inputs.select(["red", "green", "blue"], {label: "colors", multiple: true});
}

export async function selectMultipleValue() {
  return Inputs.select(["red", "green", "blue"], {label: "colors", multiple: true, value: ["red", "blue"]});
}

export async function selectMultipleMapKey() {
  return Inputs.select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {multiple: true, key: ["red", "blue"]});
}

export async function selectMultipleMapValue() {
  return Inputs.select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {multiple: true, value: ["#f00", "#00f"]});
}

export async function selectMultipleLong() {
  return Inputs.select("ABCDEFGHIJKLMNOPQRSTUVWXYZ", {multiple: true});
}

export async function selectMultipleSize() {
  return Inputs.select(["red", "green", "blue"], {label: "colors", multiple: 5});
}

export async function selectUnique() {
  return Inputs.select(["red", "red", "green", "Green", "blue", "blue"], {unique: true});
}

export async function selectUniqueFormat() {
  return Inputs.select(["red", "Red", "green", "Green", "blue", "Blue"], {format: x => x.toLowerCase(), unique: true});
}

export async function selectUniqueMultiple() {
  return Inputs.select(["red", "red", "green", "Green", "blue", "blue"], {unique: true, multiple: true});
}

export async function selectSortTrue() {
  return Inputs.select([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: true});
}

export async function selectSortFalse() {
  return Inputs.select([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: false});
}

export async function selectSortAscending() {
  return Inputs.select([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "ascending"});
}

export async function selectSortDescending() {
  return Inputs.select([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "descending"});
}

export async function selectSortFunction() {
  return Inputs.select([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: (a, b) => a < b ? -1 : a > b ? 1 : 0});
}

export async function selectSortFormat() {
  return Inputs.select([..."CXQZaLORbNHtmjDVFGWsKeupyI"], {format: x => x.toLowerCase(), sort: true});
}

export async function selectValue() {
  return Inputs.select(["red", "green", "blue"], {value: "green"});
}

export async function selectWide() {
  return Inputs.select(["red", "green", "blue"], {width: "20em"});
}

export async function selectDisabled() {
  return Inputs.select(["red", "green", "blue"], {disabled: true});
}

export async function selectDisabledSome() {
  return Inputs.select(["red", "green", "blue"], {disabled: ["green"]});
}
