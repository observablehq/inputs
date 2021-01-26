import {html} from "htl";
import {formatNumber, stringify} from "./format.js";
import {boxSizing, defaultStyle, mr1, mr2} from "./style.js";

export function Range([min, max] = [0, 1], {
  format = formatNumber,
  label = "",
  value,
  step,
  style = {}
} = {}) {
  if (typeof format !==  "function") throw new TypeError("format is not a function");
  const {width = "180px", ...formStyle} = style;
  const form = html`<form style=${{...defaultStyle, ...formStyle}}>
    <input name=input oninput=${oninput} type=range style=${{...mr2, ...boxSizing, width}}><output name=output style=${mr1}></output>${label}
  </form>`;
  const {input, output} = form.elements;
  input.min = min = +min;
  input.max = max = +max;
  input.step = step === undefined ? "any" : +step;
  input.value = value === undefined ? (min + max) / 2 : +value;
  function oninput() { output.value = stringify(format(form.value = input.valueAsNumber)); }
  oninput();
  return form;
}
