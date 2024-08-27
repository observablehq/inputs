import {html} from "htl";
import {maybeWidth} from "./css.js";
import {maybeLabel} from "./label.js";
import {createText} from "./text.js";

export function file({
  label,
  required,
  accept,
  capture,
  multiple,
  disabled,
  width,
  value, // eslint-disable-line no-unused-vars
  submit, // eslint-disable-line no-unused-vars
  transform = (file) => file,
  ...options
} = {}) {
  const input = html`<input
    type=file
    name=file
    disabled=${disabled}
    required=${required}
    accept=${accept}
    capture=${capture}
    multiple=${multiple}
  >`;
  const form = html`<form class=__ns__ style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div class=__ns__-input>
      ${input}
    </div>
  </form>`;
  return createText(form, input, undefined, options, {
    get: (input) => multiple ? Array.from(input.files, (file) => transform(file))
      : input.files.length ? transform(input.files[0])
      : null,
    set: () => {}, // ignored
    same: () => false // ignored
  });
}
