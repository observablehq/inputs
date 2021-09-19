import {html} from "htl";
import {maybeWidth} from "./css.js";
import {maybeDatalist} from "./datalist.js";
import {checkValidity, dispatchInput, preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

export function createText(form, input, {
  value = "",
  submit,
  get = (input) => input.value,
  set = (input, value) => input.value = stringify(value),
  same = (input, value) => input.value === value,
  validate = checkValidity
} = {}) {
  submit = submit === true ? "Submit" : submit || null;
  const button = submit ? html`<button type=submit disabled>${submit}` : null;
  if (submit) input.after(button);
  set(input, value);
  value = validate(input) ? get(input) : undefined;
  form.onsubmit = onsubmit;
  input.oninput = oninput;
  function update() {
    if (validate(input)) {
      value = get(input);
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
      button.disabled = same(input, value);
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
      set(input, v);
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
  max,
  minlength,
  maxlength,
  required = minlength > 0,
  datalist,
  readonly,
  disabled,
  width,
  ...options
} = {}) {
  const [list, listId] = maybeDatalist(datalist);
  const input = html`<input type=${type} name=text list=${listId} readonly=${readonly} disabled=${disabled} required=${required} min=${min} max=${max} minlength=${minlength} maxlength=${maxlength} pattern=${pattern} spellcheck=${spellcheck === undefined ? false : spellcheck === null ? null : spellcheck + ""} placeholder=${placeholder}>`;
  const form = html`<form class=__ns__ style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div class=__ns__-input>
      ${input}
    </div>${list}
  </form>`;
  return createText(form, input, options);
}
