import {html} from "htl";
import {preventDefault} from "./event.js";
import {boxSizing, defaultStyle, mr2, textStyle} from "./style.js";

export function Button(text = "≡", {
  label = "",
  value = 0,
  reduce = value => value + 1,
  style = {}
} = {}) {
  if (reduce !== undefined && typeof reduce !== "function") throw new TypeError("reduce is not a function");
  const {width, ...formStyle} = style;
  const form = html`<form style=${{...defaultStyle, ...formStyle}} onsubmit=${preventDefault}>
    <button onclick=${onclick} style=${{...mr2, ...boxSizing, ...textStyle, width}}>${text}</button>${label}
  </form>`;
  function onclick() {
    form.value = value = reduce(value);
    form.dispatchEvent(new CustomEvent("input"));
  }
  form.value = value;
  return form;
}
