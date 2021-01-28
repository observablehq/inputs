import {html} from "htl";
import {preventDefault} from "./event.js";
import {formatNumber} from "./format.js";
import {maybeLabel} from "./label.js";
import {boxSizing, defaultStyle, textStyle, mr2, flexStyle} from "./style.js";

const numberStyle = {...textStyle, fontVariantNumeric: "tabular-nums", width: "60px"};
const rangeStyle = {...mr2, ...boxSizing};

export function Range([min, max] = [0, 1], {
  format = d => formatNumber(d).replace(/,/g, ""), // number is strict!
  label = "",
  value,
  step,
  style = {}
} = {}) {
  if (typeof format !==  "function") throw new TypeError("format is not a function");
  const {width = "calc(180px - 1em)", ...formStyle} = style;
  const form = html`<form style=${{...defaultStyle, ...formStyle}} onsubmit=${preventDefault}>
    ${maybeLabel(label)}<div style=${flexStyle}>
      <input type=number name=number oninput=${onnumber} style=${numberStyle}>
      <input type=range name=range oninput=${onrange} style=${{...rangeStyle, width}}>
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
      value = v;
      number.value = format(v);
      range.value = v;
    }
  });
}
