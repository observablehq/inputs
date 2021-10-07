import {html} from "htl";
import {parse as isoparse} from "isoformat";
import {maybeWidth} from "./css.js";
import {maybeLabel} from "./label.js";
import {createText} from "./text.js";

const dateops = {
  get: (input) => input.valueAsDate,
  set: (input, value) => input.value = formatDate(value),
  same: (input, value) => +input.valueAsDate === +value,
  format: formatDate
};

// datetime-local pedantically refuses to support valueAsDate, so here we use
// the Date constructor to convert the input based on the user’s local time zone
// (which you think would be implied by datetime-local)?
// https://github.com/whatwg/html/issues/4770
const datetimeops = {
  get: (input) => input.value ? new Date(input.value) : null,
  set: (input, value) => input.value = formatDatetime(value),
  same: (input, value) => +new Date(input.value) === +value,
  format: formatDatetime
};

export function date({
  type = "date",
  label,
  min,
  max,
  required,
  readonly,
  disabled,
  width,
  value,
  ...options
} = {}, {
  format,
  ...ops
} = dateops) {
  const input = html`<input type=${type} name=date readonly=${readonly} disabled=${disabled} required=${required} min=${format(min)} max=${format(max)}>`;
  const form = html`<form class=__ns__ style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div class=__ns__-input>
      ${input}
    </div>
  </form>`;
  return createText(form, input, coerce(value), options, ops);
}

export function datetime(options) {
  return date({...options, type: "datetime-local"}, datetimeops);
}

function coerce(value) {
  return value instanceof Date && !isNaN(value) ? value
    : typeof value === "string" ? isoparse(value, null)
    : value == null || isNaN(value = +value) ? null
    : new Date(+value);
}

function formatDate(value) {
  return (value = coerce(value))
    ? value.toISOString().slice(0, 10)
    : value;
}

function formatDatetime(value) {
  return (value = coerce(value))
    ? value.toISOString().slice(0, 16)
    : value;
}
