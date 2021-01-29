import {html} from "htl";
import {arrayify} from "./array.js";
import {preventDefault} from "./event.js";
import {maybeLabel} from "./label.js";

export function Radio(data, {
  format = d => d,
  label,
  value,
  multiple,
  style = {}
} = {}) {
  multiple = !!multiple;
  if (multiple) value = value === undefined ? [] : arrayify(value);
  else if (value === undefined) value = null;
  const {...formStyle} = style;
  const form = html`<form class=__ns__ style=${formStyle} onchange=${onchange} oninput=${oninput} onsubmit=${preventDefault}>
    ${maybeLabel(label)}<div>
      ${Array.from(data, (d, i) => html`<label><input type=${multiple ? "checkbox" : "radio"} name="input" value=${i} checked=${multiple ? value.includes(d) : value === d}>${format(d, i, data)}`)}
    </div>
  </form>`;
  const {input} = form.elements;
  function onchange() {
    form.dispatchEvent(new CustomEvent("input")); // Safari
  }
  function oninput(event) {
    if (event && event.isTrusted) form.onchange = null;
    value = multiple
      ? Array.from(input).filter(i => i.checked).map(i => data[i.value])
      : data[input.value];
  }
  return Object.defineProperty(form, "value", {
    get() {
      return value;
    },
    set(v) {
      if (multiple) {
        const selection = new Set(v);
        for (const i of input) i.checked = selection.has(data[i.value]);
      } else {
        input.value = data.indexOf(v);
      }
      oninput();
    }
  });
}
