import {html} from "htl";
import {length} from "./css.js";
import {maybeDatalist} from "./datalist.js";
import {dispatchInput, preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

export function Text({
  label,
  type = "text",
  value = "",
  validate = checkValidity,
  placeholder,
  pattern,
  spellcheck,
  submit,
  minlength,
  maxlength,
  required = minlength > 0,
  datalist,
  disabled,
  width
} = {}) {
  submit = submit === true ? "Submit" : submit || null;
  const [list, listId] = maybeDatalist(datalist);
  const button = submit ? html`<button type=submit disabled>${submit}` : null;
  const form = html`<form class=__ns__ onsubmit=${onsubmit}>
    ${maybeLabel(label)}<div class=__ns__-input style=${{width: length(width)}}>
      <input type=${type} name=text list=${listId} disabled=${disabled} required=${required} minlength=${minlength} maxlength=${maxlength} pattern=${pattern} spellcheck=${spellcheck === undefined ? false : spellcheck + ""} placeholder=${placeholder} value=${stringify(value)} oninput=${oninput}>${button}
    </div>${list}
  </form>`;
  const {text} = form.elements;
  function update() {
    if (validate(text)) {
      value = text.value;
      return true;
    }
  }
  function onsubmit(event) {
    if (submit && update()) {
      button.disabled = true;
      dispatchInput(event);
    }
    preventDefault(event);
  }
  function oninput(event) {
    if (submit) {
      button.disabled = value === text.value;
      event.stopPropagation();
    } else if (!update()) {
      event.stopPropagation();
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

function checkValidity(text) {
  return text.checkValidity();
}
