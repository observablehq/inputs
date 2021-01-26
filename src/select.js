import {html} from "htl";
import {defaultStyle, marginRight} from "./style.js";

export function Select(data, {
  format = data instanceof Map ? ([key]) => key : d => d,
  value = data instanceof Map ? ([, value]) => value : d => d,
  label,
  initialValue,
  initialIndex,
  style
} = {}) {
  if (typeof format !== "function") throw new TypeError("format is not a function");
  if (typeof value !== "function") throw new TypeError("value is not a function");
  data = Array.from(data);
  if (initialIndex === undefined) initialIndex = initialValue === undefined ? 0 : data.indexOf(initialValue);
  const form = html`<form
    onchange=${() => form.dispatchEvent(new CustomEvent("input"))}
    oninput=${oninput}
    style=${{...defaultStyle, ...style}}>
    <select style=${marginRight} name=input>
      ${data.map((d, i) => html`<option selected=${i === initialIndex}>${format(d, i, data) + ""}`)}
    </select>${label}`;
  const {input} = form.elements;
  function oninput(event) {
    if (event && event.isTrusted) form.onchange = null;
    const i = input.selectedIndex;
    form.value = value(data[i], i, data);
  }
  oninput();
  return form;
}
