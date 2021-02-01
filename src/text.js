import {html} from "htl";
import {length} from "./css.js";
import {dispatchInput, preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

export function Text({
  label,
  value = "",
  placeholder,
  pattern,
  spellcheck,
  submit,
  minlength,
  maxlength,
  disabled,
  width
} = {}) {
  submit = submit === true ? "Submit" : submit ? submit + "" : null;
  const button = submit ? html`<button type=submit disabled>${submit}` : null;
  const form = html`<form class=__ns__ onsubmit=${onsubmit}>
    ${maybeLabel(label)}<div class=__ns__-input style=${{width: length(width)}}>
      <input type=text name=text disabled=${disabled} minlength=${minlength} maxlength=${maxlength} pattern=${pattern} spellcheck=${spellcheck === undefined ? false : spellcheck + ""} placeholder=${placeholder} value=${stringify(value)} oninput=${oninput}>${button}
    </div>
  </form>`;
  const {text} = form.elements;
  function onsubmit(event) {
    if (submit) {
      value = text.value;
      button.disabled = true;
      dispatchInput(event);
    }
    preventDefault(event);
  }
  function oninput(event) {
    if (submit) {
      button.disabled = value === text.value;
      event.stopPropagation();
    } else {
      value = text.value;
    }
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
