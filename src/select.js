import {html} from "htl";

export function Select(data, {
  format = data instanceof Map ? ([key]) => key : d => d,
  value = data instanceof Map ? ([, value]) => value : d => d,
  label = "",
  font = "13px var(--sans-serif)",
  color,
  initialValue,
  initialIndex
} = {}) {
  data = Array.from(data);
  if (initialIndex === undefined) initialIndex = initialValue === undefined ? 0 : data.indexOf(initialValue);
  const form = html`<form
    onchange=${() => form.dispatchEvent(new CustomEvent("input"))}
    oninput=${(event) => {
      if (event && event.isTrusted) form.onchange = null;
      const i = form.i.selectedIndex;
      form.value = value(data[i], i, data);
    }}
    style=${{display: "flex", font, color, alignItems: "center", minHeight: 33}}>
    <select style=${{margin: "0 0.4em 0 0"}} name="i">
      ${data.map((d, i) => html`<option selected=${i === initialIndex}>${format(d, i, data)}`)}
    </select>${label}`;
  form.oninput();
  return form;
}
