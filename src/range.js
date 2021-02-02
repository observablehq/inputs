import {html} from "htl";
import {length} from "./css.js";
import {preventDefault} from "./event.js";
import {formatNumber} from "./format.js";
import {maybeLabel} from "./label.js";
import {solve} from "./newton.js";

const linear = Object.assign(x => x, { invert: x => x });

export function Range([min, max] = [0, 1], {
  format = d => formatNumber(d).replace(/,/g, ""), // number is strict!
  transform = linear,
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
  if (typeof transform.invert !== "function") transform.invert  = x => solve(transform, x, x);

  const {range, number} = form.elements;
  range.min = transform.invert(number.min = min = +min);
  range.max = transform.invert(number.max = max = +max);
  number.step = range.step = step === undefined ? "any" : step = +step;
  if (value === undefined) {
    range.value = (+range.min + +range.max) / 2;
    number.value = transform(range.valueAsNumber);
  } else {
    number.value = +value;
    range.value = transform.invert(number.value);
  }
  
  function onrange() {
    number.value = format(value = transform(range.valueAsNumber));
  }
  function onnumber() {
    range.value = transform.invert(value = number.valueAsNumber);
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
