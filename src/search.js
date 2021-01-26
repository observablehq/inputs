import {html} from "htl";
import {arrayify} from "./array.js";
import {formatNumber, stringify} from "./format.js";
import {boxSizing, defaultStyle, marginRight} from "./style.js";

export function Search(data, {
  format = value => `${formatNumber(value.length)} results`, // length format
  value = "", // initial search query
  placeholder = "Search", // placeholder text to show when empty
  filter = searchFilter, // returns the filter function given query
  style = {}
} = {}) {
  const columns = data.columns;
  data = arrayify(data);
  const {width = "180px", ...formStyle} = style;
  const form = html`<form style=${{...defaultStyle, ...formStyle}} onsubmit=${event => event.preventDefault()}>
    <input name=input type=search style=${{...marginRight, ...boxSizing, width}} placeholder=${placeholder} value=${value} oninput=${oninput}><output name=output>
  </form>`;
  const {input, output} = form.elements;
  function oninput() {
    const value = data.filter(filter(input.value));
    if (columns !== undefined) value.columns = columns;
    form.value = value;
    output.value = input.value ? stringify(format(value)) : "";
  }
  oninput();
  return form;
}

export function searchFilter(query) {
  const filters = (query + "").split(/\s+/g).filter(t => t).map(termFilter);
  return d => {
    if (d == null) return false;
    if (typeof d === "object") {
      out: for (const filter of filters) {
        for (const value of valuesof(d)) {
          if (filter.test(value)) {
            continue out;
          }
        }
        return false;
      }
    } else {
      for (const filter of filters) {
        if (!filter.test(d)) {
          return false;
        }
      }
    }
    return true;
  };
}

function* valuesof(d) {
  for (const key in d) {
    yield d[key];
  }
}

function termFilter(term) {
  return new RegExp(`\\b${escapeRegExp(term)}`, "i");
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
