import {html} from "htl";
import {arrayify, maybeColumns} from "./array.js";
import {maybeWidth} from "./css.js";
import {maybeDatalist} from "./datalist.js";
import {preventDefault} from "./event.js";
import {formatLocaleNumber, localize, stringify} from "./format.js";
import {maybeLabel} from "./label.js";
import {onoff, truefalse} from "./text.js";

export function search(data, {
  locale,
  format = formatResults(locale), // length format
  label,
  query = "", // initial search query
  placeholder = "Search", // placeholder text to show when empty
  columns = maybeColumns(data),
  spellcheck,
  autocomplete,
  autocapitalize,
  filter = columns === undefined ? searchFilter : columnFilter(columns), // returns the filter function given query
  datalist,
  disabled,
  required = true, // if true, the value is everything if nothing is selected
  width
} = {}) {
  let value = [];
  data = arrayify(data);
  required = !!required;
  const [list, listId] = maybeDatalist(datalist);
  const input = html`<input
    name=input
    type=search
    list=${listId}
    disabled=${disabled}
    spellcheck=${truefalse(spellcheck)}
    autocomplete=${onoff(autocomplete)}
    autocapitalize=${onoff(autocapitalize)}
    placeholder=${placeholder}
    value=${query}
    oninput=${oninput}
  >`;
  const output = html`<output name=output>`;
  const form = html`<form class=__ns__ style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div class=__ns__-input>
      ${input}${output}
    </div>${list}
  </form>`;
  form.addEventListener("submit", preventDefault);
  function oninput() {
    value = input.value || required ? data.filter(filter(input.value)) : [];
    if (columns !== undefined) value.columns = columns;
    output.value = format(value.length);
  }
  oninput();
  return Object.defineProperties(form, {
    value: {
      get() {
        return value;
      }
    },
    query: {
      get() {
        return query;
      },
      set(v) {
        query = input.value = stringify(v);
        oninput();
      }
    }
  });
}

export function searchFilter(query) {
  const filters = `${query}`.split(/\s+/g).filter(t => t).map(termFilter);
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
    const filters = `${query}`.split(/\s+/g).filter(t => t).map(termFilter);
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
  return new RegExp(`(?:^|[^\\p{L}-])${escapeRegExp(term)}`, "iu");
}

function escapeRegExp(text) {
  return text.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

const formatResults = localize(locale => {
  const formatNumber = formatLocaleNumber(locale);
  return length => `${formatNumber(length)} result${length === 1 ? "" : "s"}`;
});
