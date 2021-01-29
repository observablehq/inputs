import {html} from "htl";

export function maybeLabel(label) {
  return label ? html`<div class=__ns__-label>${label}` : null;
}
