import {Radio} from "@observablehq/inputs";
import {html} from "htl";

export async function radio() {
  return Radio(["red", "green", "blue"]);
}

export async function radioFormat() {
  return Radio(["red", "green", "blue"], {format: x => x.toUpperCase()});
}

export async function radioLabel() {
  return Radio(["red", "green", "blue"], {label: "dollars&pounds"});
}

export async function radioLabelHtml() {
  return Radio(["red", "green", "blue"], {label: html`<b>color</b>`});
}

export async function radioMap() {
  return Radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]));
}

export async function radioMapFormat() {
  return Radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {format: ([key, value]) => `${key} (${value})`});
}

export async function radioMapKey() {
  return Radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {key: "green"});
}

export async function radioMapValue() {
  return Radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {value: "#0f0"});
}

export async function radioMultiple() {
  return Radio(["red", "green", "blue"], {label: "colors", multiple: true});
}

export async function radioMultipleValue() {
  return Radio(["red", "green", "blue"], {label: "colors", multiple: true, value: ["red", "blue"]});
}

export async function radioMultipleMapKey() {
  return Radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {multiple: true, key: ["red", "blue"]});
}

export async function radioMultipleMapValue() {
  return Radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {multiple: true, value: ["#f00", "#00f"]});
}

export async function radioMultipleLong() {
  return Radio("ABCDEFGHIJKLMNOPQRSTUVWXYZ", {multiple: true});
}

export async function radioMultipleSize() {
  return Radio(["red", "green", "blue"], {label: "colors", multiple: 5});
}

export async function radioUnique() {
  return Radio(["red", "red", "green", "Green", "blue", "blue"], {unique: true});
}

export async function radioUniqueFormat() {
  return Radio(["red", "Red", "green", "Green", "blue", "Blue"], {format: x => x.toLowerCase(), unique: true});
}

export async function radioSortTrue() {
  return Radio([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: true});
}

export async function radioSortFalse() {
  return Radio([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: false});
}

export async function radioSortAscending() {
  return Radio([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "ascending"});
}

export async function radioSortDescending() {
  return Radio([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "descending"});
}

export async function radioSortFunction() {
  return Radio([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: (a, b) => a < b ? -1 : a > b ? 1 : 0});
}

export async function radioSortFormat() {
  return Radio([..."CXQZaLORbNHtmjDVFGWsKeupyI"], {format: x => x.toLowerCase(), sort: true});
}

export async function radioValue() {
  return Radio(["red", "green", "blue"], {value: "green"});
}

export async function radioWide() {
  return Radio(["red", "green", "blue"], {width: "20em"});
}

export async function radioDisabled() {
  return Radio(["red", "green", "blue"], {disabled: true});
}

export async function radioDisabledSome() {
  return Radio(["red", "green", "blue"], {disabled: ["green"]});
}
