import {html} from "htl";
import {maybeWidth} from "./css.js";
import {maybeLabel} from "./label.js";
import {createText} from "./text.js";

export function date({
  label,
  min,
  max,
  required,
  readonly,
  disabled,
  width,
  value,
  ...options
} = {}) {
  const input = html`<input type=date name=date readonly=${readonly} disabled=${disabled} required=${required} min=${format(min)} max=${format(max)}>`;
  const form = html`<form class=__ns__ style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div class=__ns__-input>
      ${input}
    </div>
  </form>`;
  value = coerce(value);
  return createText(form, input, {
    ...options,
    value,
    get: (input) => input.valueAsDate,
    set: (input, value) => input.value = format(value),
    same: (input, value) => +input.valueAsDate === +value
  });
}

function coerce(value) {
  return value instanceof Date && !isNaN(value) ? value
    : value == null ? null
    : new Date(+value);
}

function format(value) {
  return (value = coerce(value))
    ? value.toISOString().slice(0, 10)
    : value;
}
