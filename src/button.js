import {html} from "htl";
import {preventDefault} from "./event.js";
import {maybeLabel} from "./label.js";

export function Button(text = "≡", {
  label = "",
  value = 0,
  reduce = value => value + 1,
  style = {}
} = {}) {
  if (typeof reduce !== "function") throw new TypeError("reduce is not a function");
  const {width, ...formStyle} = style;
  const form = html`<form class=__ns__ style=${formStyle} onsubmit=${preventDefault}>
    ${maybeLabel(label)}<button onclick=${onclick} style=${{width}}>${text}</button>
  </form>`;
  function onclick() {
    form.value = reduce(form.value);
    form.dispatchEvent(new CustomEvent("input"));
  }
  form.value = value;
  return form;
}
