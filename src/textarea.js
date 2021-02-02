import {html} from "htl";
import {length} from "./css.js";
import {dispatchInput, preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

export function Textarea({
  label,
  value = "",
  placeholder,
  spellcheck,
  submit,
  rows,
  cols,
  fontFamily,
  readonly,
  resize,
  minlength,
  maxlength,
  disabled,
  width
} = {}) {
  submit = submit === true ? "Submit" : submit || null;
  width = width !== undefined ? length(width) : cols !== undefined ? `${1 + cols * 0.61}em` : undefined;
  fontFamily = fontFamily === undefined ? null : fontFamily;
  const button = submit ? html`<button type=submit disabled>${submit}` : null;
  const form = html`<form class=__ns__ onsubmit=${onsubmit} style=${{width: "640px", maxWidth: "100%"}}>
    ${maybeLabel(label)}<div class=__ns__-textarea style=${{width}}>
      <textarea name=text disabled=${disabled} rows=${rows} cols=${cols} readonly=${readonly} minlength=${minlength} maxlength=${maxlength} spellcheck=${spellcheck === undefined ? false : spellcheck + ""} placeholder=${placeholder} oninput=${oninput} style=${{width, resize, fontFamily}}>${stringify(value)}</textarea>${button}
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
