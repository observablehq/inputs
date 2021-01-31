import {html} from "htl";
import {createChooser} from "./chooser.js";
import {length} from "./css.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

export const Select = createChooser({
  render(data, keys, selected, disabled, {format = d => d, multiple, size, label, width}) {
    if (typeof format !== "function") throw new TypeError("format is not a function");
    const form = html`<form class=__ns__>
      ${maybeLabel(label)}<select disabled=${disabled === true} style=${{width: length(width)}} multiple=${multiple} size=${size} name=input>
        ${keys.map(([key, i]) => html`<option value=${i} disabled=${typeof disabled === "function" ? disabled(i) : false} selected=${selected(i)}>${stringify(format(key, i, data))}`)}
      </select>
    </form>`;
    return [form];
  },
  selectedIndexes(input) {
    return Array.from(input.selectedOptions, i => +i.value);
  },
  select(input, selected) {
    input.selected = selected;
  }
});
