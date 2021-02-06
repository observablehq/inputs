import {html} from "htl";
import {newId} from "./id.js";

export function maybeLabel(label, input) {
  if (!label) return null;
  label = html`<label class=__ns__-label>${label}`;
  if (input !== undefined) label.htmlFor = input.id = newId();
  return label;
}
