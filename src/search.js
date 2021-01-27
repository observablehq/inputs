import {html} from "htl";
import {arrayify} from "./array.js";
import {formatNumber, stringify} from "./format.js";
import {boxSizing, defaultStyle, mr1, mr2} from "./style.js";

export function Search(data, {
  format = value => formatNumber(value.length), // length format
  label = "results",
  value = "", // initial search query
  placeholder = "Search", // placeholder text to show when empty
  columns = data.columns,
  filter = columns === undefined ? searchFilter : columnFilter(columns), // returns the filter function given query
  style = {}
} = {}) {
  data = arrayify(data);
  label = html`<span>${label}`;
  const {width = "180px", ...formStyle} = style;
  const form = html`<form style=${{...defaultStyle, ...formStyle}} onsubmit=${event => event.preventDefault()}>
    <input name=input type=search style=${{...mr2, ...boxSizing, width}} placeholder=${placeholder} value=${value} oninput=${oninput}><output name=output style=${mr1}></output>${label}
  </form>`;
  const {input, output} = form.elements;
  function oninput() {
    const value = data.filter(filter(input.value));
    if (columns !== undefined) value.columns = columns;
    form.value = value;
    if (input.value) {
      output.value = stringify(format(value));
      label.style.display = "inline";
    } else {
      output.value = "";
      label.style.display = "none";
    }
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

function columnFilter(columns) {
  return query => {
    const filters = (query + "").split(/\s+/g).filter(t => t).map(termFilter);
    return d => {
      out: for (const filter of filters) {
        for (const column of columns) {
          if (filter.test(d[column])) {
            continue out;
          }
        }
        return false;
      }
      return true;
    };
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
