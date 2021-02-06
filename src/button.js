import {html} from "htl";
import {length} from "./css.js";
import {dispatchInput, preventDefault} from "./event.js";
import {maybeLabel} from "./label.js";

export function Button(content = "≡", {
  label = "",
  value = 0,
  reduce = value => value + 1,
  disabled,
  width
} = {}) {
  if (typeof reduce !== "function") throw new TypeError("reduce is not a function");
  const button = html`<button onclick=${onclick} disabled=${disabled} style=${{width: length(width)}}>${content}`;
  const form = html`<form class=__ns__ onsubmit=${preventDefault}>${maybeLabel(label, button)}${button}`;
  function onclick(event) {
    form.value = reduce(form.value);
    dispatchInput(event);
  }
  form.value = value;
  return form;
}
