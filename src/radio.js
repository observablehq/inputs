import {html} from "htl";
import {preventDefault} from "./event";
import {defaultStyle, flexStyle, mr2} from "./style";

const radioStyle = {...mr2, ...flexStyle};

export function Radio(data, {
  format = d => d,
  label,
  value,
  style = {}
} = {}) {
  const {...formStyle} = style;
  const form = html`<form style=${{...defaultStyle, ...formStyle}} onchange=${onchange} oninput=${oninput} onsubmit=${preventDefault}>${Array.from(data, (d, i) => html`<label style=${radioStyle}><input type="radio" style=${mr2} name="radio" value=${i} checked=${value === d}>${format(d, i, data)}`)}${label ? html.fragment`<span style=${{color: "#aaa", margin: "0 0.5em 0 0"}}>—</span>${label}` : null}</form>`;
  const {radio} = form.elements;
  function onchange() {
    form.dispatchEvent(new CustomEvent("input")); // Safari
  }
  function oninput(event) {
    if (event && event.isTrusted) form.onchange = null;
    value = data[radio.value];
  }
  return Object.defineProperty(form, "value", {
    get() {
      return value;
    },
    set(v) {
      radio.value = data.indexOf(v);
      value = data[radio.value];
    }
  });
}
