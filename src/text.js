import {html} from "htl";
import {length} from "./css.js";
import {dispatchInput, preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

let nextListId = 0;

export function Text({
  label,
  value = "",
  placeholder,
  pattern,
  spellcheck,
  submit,
  minlength,
  maxlength,
  datalist,
  disabled,
  width
} = {}) {
  submit = submit === true ? "Submit" : submit ? submit + "" : null;
  const listId = datalist !== undefined ? `__ns__-${++nextListId}` : null;
  const button = submit ? html`<button type=submit disabled>${submit}` : null;
  const form = html`<form class=__ns__ onsubmit=${onsubmit}>
    ${maybeLabel(label)}<div class=__ns__-input style=${{width: length(width)}}>
      <input type=text name=text list=${listId} disabled=${disabled} minlength=${minlength} maxlength=${maxlength} pattern=${pattern} spellcheck=${spellcheck === undefined ? false : spellcheck + ""} placeholder=${placeholder} value=${stringify(value)} oninput=${oninput}>${button}
    </div>
    ${datalist !== undefined ? html`<datalist id=${listId}>${Array.from(datalist, value => html`<option value=${stringify(value)}>`)}` : null}
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
