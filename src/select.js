import {html} from "htl";
import {createChooser} from "./chooser.js";
import {maybeWidth} from "./css.js";
import {formatLocaleAuto} from "./format.js";
import {maybeLabel} from "./label.js";

export const select = createChooser({
  render(data, index, selected, disabled, {locale, format, multiple, size, label, width}) {
    const reformat = formatLocaleAuto(locale); // In case the user-provided format doesn’t actually return a string.
    const select = html`<select class=__ns__-input disabled=${disabled === true} multiple=${multiple} size=${size} name=input>
      ${index.map(i => html`<option value=${i} disabled=${typeof disabled === "function" ? disabled(i) : false} selected=${selected(i)}>${reformat(format(data[i], i, data))}`)}
    </select>`;
    const form = html`<form class=__ns__ style=${maybeWidth(width)}>${maybeLabel(label, select)}${select}`;
    return [form, select];
  },
  selectedIndexes(input) {
    return Array.from(input.selectedOptions, i => +i.value);
  },
  select(input, selected) {
    input.selected = selected;
  }
});
