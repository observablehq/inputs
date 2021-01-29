import {html} from "htl";
import {preventDefault} from "./event.js";
import {formatNumber} from "./format.js";
import {maybeLabel} from "./label.js";

export function Range([min, max] = [0, 1], {
  format = d => formatNumber(d).replace(/,/g, ""), // number is strict!
  label = "",
  value,
  step,
  style = {}
} = {}) {
  if (typeof format !==  "function") throw new TypeError("format is not a function");
  const {width, ...formStyle} = style;
  const form = html`<form class=__ns__ style=${formStyle} onsubmit=${preventDefault}>
    ${maybeLabel(label)}<div class=__ns__-input>
      <input type=number name=number oninput=${onnumber}>
      <input type=range name=range oninput=${onrange} style=${{width}}>
    </div>
  </form>`;
  const {range, number} = form.elements;
  number.min = range.min = min = +min;
  number.max = range.max = max = +max;
  number.step = range.step = step === undefined ? "any" : step = +step;
  number.value = range.value = value === undefined ? (min + max) / 2 : +value;
  function onrange() {
    number.value = format(value = range.valueAsNumber);
  }
  function onnumber() {
    range.value = value = number.valueAsNumber;
  }
  onrange();
  return Object.defineProperty(form, "value", {
    get() {
      return value;
    },
    set(v) {
      range.value = v;
      onrange();
    }
  });
}
