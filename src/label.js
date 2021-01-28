import {html} from "htl";
import {mr2} from "./style.js";

const labelStyle = {width: "160px", ...mr2};

export function maybeLabel(label) {
  return label ? html`<div style=${labelStyle}>${label}` : null;
}
