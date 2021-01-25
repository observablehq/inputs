import {html} from "htl";

export function Range([min, max], {
  format = d => d.toLocaleString("en"),
  label = "",
  width = 180,
  value,
  step
} = {}) {
  const form = html`<form style="font: 13px var(--sans-serif); display: flex; align-items: center; min-height: 33px;">${Object.assign(html`<input name=i type=range style="margin: 0 0.4em 0 0; width: ${+width}px;">`, {oninput() { this.form.o.value = `${format(this.form.value = this.valueAsNumber)}${label === undefined ? "" : ` ${label}`}`; }})}<output name=o>`;
  form.i.min = min = +min;
  form.i.max = max = +max;
  form.i.step = step === undefined ? "any" : +step;
  form.i.value = value === undefined ? (min + max) / 2 : +value;
  form.i.oninput();
  return form;
}
