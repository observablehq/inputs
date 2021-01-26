import {html} from "htl";
import {arrayify} from "./array.js";
import {stringify} from "./format.js";
import {boxSizing, defaultStyle, marginRight} from "./style.js";

const ns = "observablehq-select";
let nextId = 0;

export function Select(data, {
  format = data instanceof Map ? ([key]) => key : d => d,
  valueof = data instanceof Map ? ([, value]) => value : d => d,
  label,
  value,
  style = {}
} = {}) {
  if (typeof format !== "function") throw new TypeError("format is not a function");
  if (typeof valueof !== "function") throw new TypeError("valueof is not a function");
  data = arrayify(data);
  const {width = "180px", ...formStyle} = style;
  const form = html`<form
    onchange=${() => form.dispatchEvent(new CustomEvent("input"))}
    oninput=${oninput}
    style=${{...defaultStyle, ...formStyle}}>
    <select style=${{...marginRight, ...boxSizing, width}} name=input>
      ${data.map((d, i) => html`<option>${stringify(format(d, i, data))}`)}
    </select>${label}
  </form>`;
  const {input} = form.elements;
  if (value !== undefined) input.selectedIndex = data.indexOf(value);
  function oninput(event) {
    if (event && event.isTrusted) form.onchange = null;
    const i = input.selectedIndex;
    form.value = valueof(data[i], i, data);
  }
  oninput();
  return form;
}

export function AutoSelect(data, {
  format = data instanceof Map ? ([key]) => key : d => d,
  valueof = data instanceof Map ? ([, value]) => value : d => d,
  label,
  value,
  style = {}
} = {}) {
  if (typeof format !== "function") throw new TypeError("format is not a function");
  if (typeof valueof !== "function") throw new TypeError("valueof is not a function");
  data = arrayify(data);
  const {width = "180px", ...formStyle} = style;
  const index = new Map(data.map((d, i) => [stringify(format(d, i, data)), i]).reverse());
  const id = `${ns}-${++nextId}`;
  const form = html`<form
    onsubmit=${event => event.preventDefault()}
    oninput=${oninput}
    style=${{...defaultStyle, ...formStyle}}>
    <input name=input autocomplete=off list=${id} style=${{...marginRight, ...boxSizing, width}}>${label}
    <datalist id=${id}>${Array.from(index, ([key]) => html`<option>${key}`).reverse()}</datalist>
  </form>`;
  const {input} = form.elements;
  if (value !== undefined) input.value = stringify(format(value));
  function oninput() {
    const i = index.get(input.value);
    form.value = i === undefined ? null : valueof(data[i], i, data);
  }
  oninput();
  return form;
}
