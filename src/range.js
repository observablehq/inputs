import {html} from "htl";
import {maybeWidth} from "./css.js";
import {preventDefault} from "./event.js";
import {formatTrim} from "./format.js";
import {identity} from "./identity.js";
import {maybeLabel} from "./label.js";

const epsilon = 1e-6;

export function Range([min, max] = [0, 1], {
  format = formatTrim,
  transform,
  invert,
  label = "",
  value,
  step,
  disabled,
  placeholder,
  width
} = {}) {
  if (typeof format !== "function") throw new TypeError("format is not a function");
  const number = html`<input type=number name=number required placeholder=${placeholder} oninvalid=${oninvalid} oninput=${onnumber} disabled=${disabled}>`;
  const range = html`<input type=range name=range oninput=${onrange} disabled=${disabled}>`;
  const stepper = html`<input type=range>`; // untransformed range for validation
  const form = html`<form class=__ns__ onsubmit=${preventDefault} style=${maybeWidth(width)}>
    ${maybeLabel(label, number)}<div class=__ns__-input>
      ${number}${range}
    </div>
  </form>`;
  min = +min, max = +max;
  if (min > max) [min, max] = [max, min], transform === undefined && (transform = negate);
  if (transform === undefined) transform = identity;
  if (typeof transform !== "function") throw new TypeError("transform is not a function");
  if (invert === undefined) invert = transform.invert === undefined ? solver(transform) : transform.invert;
  if (typeof invert !== "function") throw new TypeError("invert is not a function");
  let tmin = +transform(stepper.min = number.min = min), tmax = +transform(stepper.max = number.max = max);
  if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
  range.min = tmin;
  range.max = tmax;
  if (step !== undefined) step = +step;
  range.step = step === undefined || (transform !== identity && transform !== negate) ? "any" : step;
  stepper.step = number.step = step === undefined ? "any" : step;
  function onrange(event) {
    let v = +invert(range.valueAsNumber);
    if (isFinite(v)) {
      stepper.valueAsNumber = v;
      number.value = format(value = stepper.valueAsNumber);
      return;
    }
    if (event) event.stopPropagation();
  }
  function onnumber(event) {
    let v = number.valueAsNumber;
    if (isFinite(v)) {
      stepper.valueAsNumber = v;
      range.valueAsNumber = transform(value = stepper.valueAsNumber);
      return;
    }
    if (event) event.stopPropagation();
  }
  function oninvalid() {
    number.value = format(value);
  }
  Object.defineProperty(form, "value", {
    get() {
      return value;
    },
    set(v) {
      if (isFinite(v = +v)) {
        stepper.valueAsNumber = v;
        value = stepper.valueAsNumber;
        number.value = format(value);
        range.valueAsNumber = transform(value);
      }
    }
  });
  if (isFinite(value = +value)) stepper.valueAsNumber = value;
  form.value = stepper.valueAsNumber;
  return form;
}

function negate(x) {
  return -x;
}

function square(x) {
  return x * x;
}

function solver(f) {
  if (f === identity || f === negate) return f;
  if (f === Math.sqrt) return square;
  if (f === Math.log) return Math.exp;
  if (f === Math.exp) return Math.log;
  return x => solve(f, x, x);
}

function solve(f, y, x) {
  let steps = 100, delta, f0, f1;
  x = x === undefined ? 0 : +x;
  y = +y;
  do {
    f0 = f(x);
    f1 = f(x + epsilon);
    if (f0 === f1) f1 = f0 + epsilon;
    x -= delta = (-1 * epsilon * (f0 - y)) / (f0 - f1);
  } while (steps-- > 0 && Math.abs(delta) > epsilon);
  return steps < 0 ? NaN : x;
}
