import {html} from "htl";
import {maybeWidth} from "./css.js";
import {checkValidity, preventDefault} from "./event.js";
import {formatTrim} from "./format.js";
import {identity} from "./identity.js";
import {maybeLabel} from "./label.js";

const epsilon = 1e-6;

export function number(extent, options) {
  if (arguments.length < 2) options = extent, extent = undefined;
  if (extent === undefined) extent = [];
  return createRange({extent}, options);
}

export function range(extent = [0, 1], options) {
  return createRange({extent, range: true}, options);
}

function createRange({
  extent: [min, max],
  range
}, {
  format = formatTrim,
  transform,
  invert,
  label = "",
  value: initialValue,
  step,
  disabled,
  placeholder,
  validate = checkValidity,
  width
} = {}) {
  let value;
  if (typeof format !== "function") throw new TypeError("format is not a function");
  if (min == null || isNaN(min = +min)) min = -Infinity;
  if (max == null || isNaN(max = +max)) max = Infinity;
  if (min > max) [min, max] = [max, min], transform === undefined && (transform = negate);
  if (step !== undefined) step = +step;
  const number = html`<input type=number min=${isFinite(min) ? min : null} max=${isFinite(max) ? max : null} step=${step == undefined ? "any" : step} name=number required placeholder=${placeholder} oninput=${onnumber} disabled=${disabled}>`;
  let irange; // untransformed range for coercion
  if (range) {
    if (transform === undefined) transform = identity;
    if (typeof transform !== "function") throw new TypeError("transform is not a function");
    if (invert === undefined) invert = transform.invert === undefined ? solver(transform) : transform.invert;
    if (typeof invert !== "function") throw new TypeError("invert is not a function");
    let tmin = +transform(min), tmax = +transform(max);
    if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
    range = html`<input type=range min=${isFinite(tmin) ? tmin : null} max=${isFinite(tmax) ? tmax : null} step=${step === undefined || (transform !== identity && transform !== negate) ? "any" : step} name=range oninput=${onrange} disabled=${disabled}>`;
    irange = transform === identity ? range : html`<input type=range min=${min} max=${max} step=${step === undefined ? "any" : step} name=range disabled=${disabled}>`;
  } else {
    range = null;
    transform = invert = identity;
  }
  const form = html`<form class=__ns__ style=${maybeWidth(width)}>
    ${maybeLabel(label, number)}<div class=__ns__-input>
      ${number}${range}
    </div>
  </form>`;
  form.addEventListener("submit", preventDefault);
  // If range, use an untransformed range to round to the nearest valid value.
  function coerce(v) {
    if (!irange) return +v;
    v = Math.max(min, Math.min(max, v));
    if (!isFinite(v)) return v;
    irange.valueAsNumber = v;
    return irange.valueAsNumber;
  }
  function onrange(event) {
    const v = coerce(invert(range.valueAsNumber));
    if (isFinite(v)) {
      number.valueAsNumber = Math.max(min, Math.min(max, v));
      if (validate(number)) {
        value = number.valueAsNumber;
        number.value = format(value);
        return;
      }
    }
    if (event) event.stopPropagation();
  }
  function onnumber(event) {
    const v = coerce(number.valueAsNumber);
    if (isFinite(v)) {
      if (range) range.valueAsNumber = transform(v);
      if (validate(number)) {
        value = v;
        return;
      }
    }
    if (event) event.stopPropagation();
  }
  Object.defineProperty(form, "value", {
    get() {
      return value;
    },
    set(v) {
      v = coerce(v);
      if (isFinite(v)) {
        number.valueAsNumber = v;
        if (range) range.valueAsNumber = transform(v);
        if (validate(number)) {
          value = v;
          number.value = format(value);
        }
      }
    }
  });
  if (initialValue === undefined && irange) initialValue = irange.valueAsNumber; // (min + max) / 2
  if (initialValue !== undefined) form.value = initialValue; // invoke setter
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
