import {html} from "htl";
import {preventDefault} from "./event.js";
import {maybeLabel} from "./label.js";
import {boxSizing, defaultStyle, textStyle} from "./style.js";

const buttonStyle = {...boxSizing, ...textStyle};

export function Button(text = "≡", {
  label = "",
  value = 0,
  reduce = value => value + 1,
  style = {}
} = {}) {
  if (typeof reduce !== "function") throw new TypeError("reduce is not a function");
  const {width, ...formStyle} = style;
  const form = html`<form style=${{...defaultStyle, ...formStyle}} onsubmit=${preventDefault}>
    ${maybeLabel(label)}<button onclick=${onclick} style=${{...buttonStyle, width}}>${text}</button>
  </form>`;
  function onclick() {
    form.value = value = reduce(value);
    form.dispatchEvent(new CustomEvent("input"));
  }
  form.value = value;
  return form;
}
