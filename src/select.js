import {html} from "htl";
import {createChooser} from "./chooser.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

export const Select = createChooser({
  render(data, keys, selection, {format = d => d, multiple, size, label, style: {width, ...formStyle} = {}}) {
    if (typeof format !== "function") throw new TypeError("format is not a function");
    return html`<form class=__ns__ style=${formStyle}>
      ${maybeLabel(label)}<select style=${{width}} multiple=${multiple} size=${size} name=input>
        ${keys.map(([key, i]) => html`<option value=${i} selected=${selection.has(i)}>${stringify(format(key, i, data))}`)}
      </select>
    </form>`;
  },
  selectedIndexes(input) {
    return Array.from(input.selectedOptions, i => +i.value);
  },
  select(input, selected) {
    input.selected = selected;
  }
});
