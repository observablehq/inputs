import {html} from "htl";
import {preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";
import {boxSizing, defaultStyle} from "./style.js";

const textStyle = boxSizing;

export function Text({
  label,
  value = "",
  placeholder,
  pattern,
  spellcheck,
  minlength,
  maxlength,
  style = {}
} = {}) {
  const {width = "240px", ...formStyle} = style;
  const form = html`<form style=${{...defaultStyle, ...formStyle}} onsubmit=${preventDefault}>
    ${maybeLabel(label)}<input type=text name=text minlength=${minlength} maxlength=${maxlength} pattern=${pattern} spellcheck=${spellcheck === undefined ? false : spellcheck + ""} placeholder=${placeholder} value=${stringify(value)} oninput=${oninput} style=${{...textStyle, width}}>
  </form>`;
  const {text} = form.elements;
  function oninput() {
    value = text.value;
  }
  return Object.defineProperty(form, "value", {
    get() {
      return value;
    },
    set(v) {
      text.value = value = v;
    }
  });
}
