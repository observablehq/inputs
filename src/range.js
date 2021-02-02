import {html} from "htl";
import {length} from "./css.js";
import {preventDefault} from "./event.js";
import {formatNumber} from "./format.js";
import {maybeLabel} from "./label.js";

const epsilon = 1e-6;
const identity = x => x;

export function Range([min, max] = [0, 1], {
  format = d => formatNumber(d).replace(/,/g, ""), // number is strict!
  transform = identity,
  invert = transform.invert === undefined ? solver(transform) : transform.invert,
  label = "",
  value,
  step,
  disabled,
  placeholder,
  width
} = {}) {
  if (typeof format !== "function") throw new TypeError("format is not a function");
  const form = html`<form class=__ns__ onsubmit=${preventDefault}>
    ${maybeLabel(label)}<div class=__ns__-input style=${{width: length(width)}}>
      <input type=number name=number placeholder=${placeholder} oninput=${onnumber} disabled=${disabled}>
      <input type=range name=range oninput=${onrange} disabled=${disabled}>
    </div>
  </form>`;
  if (typeof transform !== "function") throw new TypeError("transform is not a function");
  if (typeof invert !== "function") throw new TypeError("invert is not a function");
  const {range, number} = form.elements;
  range.min = invert(number.min = min = +min);
  range.max = invert(number.max = max = +max);
  number.step = range.step = step === undefined ? "any" : step = +step;
  number.value = value === undefined ? (min + max) / 2 : +value;
  range.value = invert(number.value);
  function onrange() {
    number.value = format(value = transform(range.valueAsNumber));
  }
  function onnumber() {
    range.value = invert(value = number.valueAsNumber);
  }
  onrange();
  return Object.defineProperty(form, "value", {
    get() {
      return value;
    },
    set(v) {
      number.value = v;
      onnumber();
    }
  });
}

function solver(f) {
  if (f === identity) return identity;
  if (f === Math.sqrt) return x => x * x;
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
