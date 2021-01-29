import {html} from "htl";
import {createChooser} from "./chooser.js";
import {maybeLabel} from "./label.js";

export const Radio = createChooser({
  render(data, keys, selection, {format = d => d, multiple, label, style: {...formStyle} = {}}) {
    if (typeof format !== "function") throw new TypeError("format is not a function");
    return html`<form class=__ns__ style=${formStyle}>
    ${maybeLabel(label)}<div>
      ${keys.map(([key, i]) => html`<label><input type=${multiple ? "checkbox" : "radio"} name="input" value=${i} checked=${selection.has(i)}>${format(key, i, data)}`)}
    </div>
  </form>`;
  },
  selectedIndexes(input) {
    return Array.from(input).filter(i => i.checked).map(i => +i.value);
  },
  select(input, selected) {
    input.checked = selected;
  }
});
