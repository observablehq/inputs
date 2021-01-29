import {html} from "htl";
import {preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

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
  const {width, ...formStyle} = style;
  const form = html`<form class=__ns__ style=${formStyle} onsubmit=${preventDefault}>
    ${maybeLabel(label)}<input type=text name=text minlength=${minlength} maxlength=${maxlength} pattern=${pattern} spellcheck=${spellcheck === undefined ? false : spellcheck + ""} placeholder=${placeholder} value=${stringify(value)} oninput=${oninput} style=${{width}}>
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
