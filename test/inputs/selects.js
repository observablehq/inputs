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

export async function selectMapKey() {
  return Select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {key: "green"});
}

export async function selectMapValue() {
  return Select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {value: "#0f0"});
}

export async function selectMultiple() {
  return Select(["red", "green", "blue"], {label: "colors", multiple: true});
}

export async function selectMultipleValue() {
  return Select(["red", "green", "blue"], {label: "colors", multiple: true, value: ["red", "blue"]});
}

export async function selectMultipleMapKey() {
  return Select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {multiple: true, key: ["red", "blue"]});
}

export async function selectMultipleMapValue() {
  return Select(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {multiple: true, value: ["#f00", "#00f"]});
}

export async function selectMultipleLong() {
  return Select("ABCDEFGHIJKLMNOPQRSTUVWXYZ", {multiple: true});
}

export async function selectMultipleSize() {
  return Select(["red", "green", "blue"], {label: "colors", multiple: 5});
}

export async function selectUnique() {
  return Select(["red", "red", "green", "Green", "blue", "blue"], {unique: true});
}

export async function selectUniqueFormat() {
  return Select(["red", "Red", "green", "Green", "blue", "Blue"], {format: x => x.toLowerCase(), unique: true});
}

export async function selectSortTrue() {
  return Select([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: true});
}

export async function selectSortFalse() {
  return Select([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: false});
}

export async function selectSortAscending() {
  return Select([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "ascending"});
}

export async function selectSortDescending() {
  return Select([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: "descending"});
}

export async function selectSortFunction() {
  return Select([..."CXQZALORBNHTMJDVFGWSKEUPYI"], {sort: (a, b) => a < b ? -1 : a > b ? 1 : 0});
}

export async function selectSortFormat() {
  return Select([..."CXQZaLORbNHtmjDVFGWsKeupyI"], {format: x => x.toLowerCase(), sort: true});
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
