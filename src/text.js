import {html} from "htl";
import {maybeWidth} from "./css.js";
import {maybeDatalist} from "./datalist.js";
import {checkValidity, dispatchInput, preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

export function createText(form, input, {value = "", submit, validate = checkValidity} = {}) {
  submit = submit === true ? "Submit" : submit || null;
  const button = submit ? html`<button type=submit disabled>${submit}` : null;
  if (submit) input.after(button);
  input.value = stringify(value);
  value = validate(input) ? input.value : undefined;
  form.onsubmit = onsubmit;
  input.oninput = oninput;
  function update() {
    if (validate(input)) {
      value = input.value;
      return true;
    }
  }
  function onsubmit(event) {
    preventDefault(event);
    if (submit) {
      if (update()) {
        button.disabled = true;
        dispatchInput(event);
      } else {
        input.reportValidity();
      }
    }
  }
  function oninput(event) {
    if (submit) {
      button.disabled = value === input.value;
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
      input.value = stringify(v);
      update();
    }
  });
}

export function text({
  label,
  type = "text",
  placeholder,
  pattern,
  spellcheck,
  min,
  minlength,
  max,
  maxlength,
  required = minlength > 0,
  datalist,
  readonly,
  disabled,
  width,
  ...options
} = {}) {
  const [list, listId] = maybeDatalist(datalist);
  const input = html`<input type=${type} name=text list=${listId} readonly=${readonly} disabled=${disabled} required=${required} min=${min} minlength=${minlength} max=${max} maxlength=${maxlength} pattern=${pattern} spellcheck=${spellcheck === undefined ? false : spellcheck + ""} placeholder=${placeholder}>`;
  const form = html`<form class=__ns__ style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div class=__ns__-input>
      ${input}
    </div>${list}
  </form>`;
  return createText(form, input, options);
}
