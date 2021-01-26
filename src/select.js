import {html} from "htl";
import {defaultStyle, marginRight} from "./style.js";

export function Select(data, {
  format = data instanceof Map ? ([key]) => maybeEmpty(key) : maybeEmpty,
  valueof = data instanceof Map ? ([, value]) => value : d => d,
  label,
  value,
  selectedIndex,
  style
} = {}) {
  if (typeof format !== "function") throw new TypeError("format is not a function");
  if (typeof valueof !== "function") throw new TypeError("valueof is not a function");
  data = Array.from(data);
  const form = html`<form
    onchange=${() => form.dispatchEvent(new CustomEvent("input"))}
    oninput=${oninput}
    style=${{...defaultStyle, ...style}}>
    <select style=${marginRight} name=input>
      ${data.map((d, i) => html`<option>${format(d, i, data) + ""}`)}
    </select>${label}
  </form>`;
  const {input} = form.elements;
  if (selectedIndex !== undefined) input.selectedIndex = selectedIndex;
  else if (value !== undefined) input.selectedIndex = data.indexOf(value);
  function oninput(event) {
    if (event && event.isTrusted) form.onchange = null;
    const i = input.selectedIndex;
    form.value = valueof(data[i], i, data);
  }
  oninput();
  return form;
}

function maybeEmpty(x) {
  return x == null ? "" : x;
}
