import {html} from "htl";
import {arrayify} from "./array.js";
import {stringify} from "./format.js";
import {ascending, descending} from "./sort.js";
import {boxSizing, defaultStyle, mr2, textStyle} from "./style.js";

export function Select(data, {
  format = data instanceof Map ? ([key]) => key : d => d,
  valueof = data instanceof Map ? ([, value]) => value : d => d,
  label,
  multiple,
  key,
  value,
  sort,
  unique,
  style = {}
} = {}) {
  if (typeof format !== "function") throw new TypeError("format is not a function");
  if (typeof valueof !== "function") throw new TypeError("valueof is not a function");
  if (sort === undefined || sort === false) sort = undefined;
  else if (sort === true || sort === "ascending") sort = ascending;
  else if (sort === "descending") sort = descending;
  else if (typeof sort !== "function") throw new TypeError("sort is not a function");
  if (multiple !== true) multiple = +multiple;
  if (value === undefined) value = key !== undefined && data instanceof Map ? (multiple > 0 ? Array.from(key, k => data.get(k)) : data.get(key)) : undefined;
  unique = !!unique;
  const selection = value === undefined ? undefined : new Set(multiple > 0 ? arrayify(value) : [value]);
  data = arrayify(data);
  if (multiple === true) multiple = Math.max(1, Math.min(data.length, 10));
  const {width = "180px", ...formStyle} = style;
  let options = data.map((d, i) => [stringify(format(d, i, data)), d, i]);
  if (sort !== undefined) options.sort(([a], [b]) => sort(a, b));
  if (unique) options = [...new Map(options.map(o => [o[0], o])).values()];
  const form = html`<form
    onchange=${() => form.dispatchEvent(new CustomEvent("input"))}
    oninput=${oninput}
    style=${{...defaultStyle, ...formStyle}}>
    <select
      style=${{...mr2, ...textStyle, ...boxSizing, width}}
      multiple=${multiple > 0}
      size=${multiple > 0 && multiple}
      name=input>
      ${options.map(([key, d, i]) => html`<option selected=${selection !== undefined && selection.has(valueof(d, i, data))}>${key}`)}
    </select>${label}
  </form>`;
  const {input} = form.elements;
  function oninput(event) {
    if (event && event.isTrusted) form.onchange = null;
    if (multiple > 0) {
      value = Array.from(input.selectedOptions, ({index: i}) => valueof(data[i], i, data));
    } else {
      const i = input.selectedIndex;
      value = valueof(data[i], i, data);
    }
  }
  oninput();
  return Object.defineProperty(form, "value", {
    get() {
      return value;
    },
    set(v) {
      value = v;
      if (multiple > 0) {
        const selection = new Set(arrayify(value));
        for (const [j, [, d, i]] of options.entries()) {
          input.options[j].selected = selection.has(valueof(d, i, data));
        }
      } else {
        input.value = v;
      }
    }
  });
}
