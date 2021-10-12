import {html} from "htl";
import {maybeWidth} from "./css.js";
import {maybeDatalist} from "./datalist.js";
import {maybeLabel} from "./label.js";
import {newId} from "./id.js";
import {createText} from "./text.js";

export function color({
  label,
  value,
  required,
  datalist,
  readonly,
  disabled,
  width,
  ...options
} = {}) {
  const [list, listId] = maybeDatalist(datalist);
  const id = newId();
  const input = html`<input
    type=color
    name=text
    value=${value}
    id=${id}
    list=${listId}
    readonly=${readonly}
    disabled=${disabled}
    required=${required}
  >`;
  const output = html`<output
    for=${id}
  >`;
  output.value = input.value;
  input.addEventListener("input", () => output.value = input.value);
  const form = html`<form class=__ns__ style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div class=__ns__-input>
      <div class=__ns__-input>${input}${output}</div>
    </div>${list}
  </form>`;
  return createText(form, input, value, options, {
    after: (button) => input.parentNode.after(button)
  });
}
