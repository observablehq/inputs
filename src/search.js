import {html} from "htl";

export function Search(data, {
  value = "", // initial search query
  placeholder = "Search", // placeholder text to show when empty
  filter = defaultFilter, // returns the filter function given query
  width // the width of the search box
} = {}) {
  const columns = data.columns;
  data = arrayof(data);

  const form = html`<form style="font: 13px var(--sans-serif); display: flex; align-items: center; min-height: 33px;">${Object.assign(html`<input name=i type=search style="margin: 0 0.4em 0 0; ${width === undefined ? "" : `width: ${+width}px;`}">`, {placeholder, value, oninput})}<output name=o>`;

  function oninput() {
    const value = data.filter(filter(form.i.value));
    if (columns !== undefined) value.columns = columns;
    form.value = value;
    form.o.value = form.i.value ? `${form.value.length.toLocaleString("en")} results` : "";
  }

  form.i.oninput();
  form.onsubmit = event => event.preventDefault();
  return form;
}

function defaultFilter(query) {
  const filters = query.split(/\s+/g).filter(t => t).map(termFilter);
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

function arrayof(x) {
  return typeof x === "object" && "length" in x
    ? x // Array, TypedArray, NodeList, array-like
    : Array.from(x); // Map, Set, iterable, string, or anything else
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
