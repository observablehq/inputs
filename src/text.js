import {html} from "htl";
import {preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {boxSizing, defaultStyle, mr2} from "./style.js";

export function Text({
  label = "",
  value = "",
  placeholder,
  pattern,
  spellcheck,
  minlength,
  maxlength,
  style = {}
} = {}) {
  const {width = "180px", ...formStyle} = style;
  const form = html`<form style=${{...defaultStyle, ...formStyle}} onsubmit=${preventDefault}>
    <input type=text name=text minlength=${minlength} maxlength=${maxlength} pattern=${pattern} spellcheck=${spellcheck === undefined ? false : spellcheck + ""} placeholder=${placeholder} value=${stringify(value)} oninput=${oninput} style=${{...mr2, ...boxSizing, width}}>${label}
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
