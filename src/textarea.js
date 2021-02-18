import {html} from "htl";
import {maybeWidth} from "./css.js";
// import {length} from "./css.js";
import {dispatchInput, preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

export function Textarea({
  label,
  value = "",
  validate, // TODO
  placeholder,
  spellcheck,
  submit,
  rows = 3,
  minlength,
  maxlength,
  required = minlength > 0,
  disabled,
  width
} = {}) {
  submit = submit === true ? "Submit" : submit || null;
  const button = submit ? html`<button type=submit disabled>${submit}` : null;
  const form = html`<form class="__ns__ __ns__-textarea" onsubmit=${onsubmit} style=${maybeWidth(width)}>
    ${maybeLabel(label)}<div>
      <textarea name=text disabled=${disabled} required=${required} rows=${rows} minlength=${minlength} maxlength=${maxlength} spellcheck=${spellcheck === undefined ? false : spellcheck + ""} placeholder=${placeholder} onkeydown=${onkeydown} oninput=${oninput} style=${{width}}>${stringify(value)}</textarea>${button}
    </div>
  </form>`;
  const {text} = form.elements;
  function onkeydown(event) {
    if (submit && event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      return onsubmit(event);
    }
  }
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
