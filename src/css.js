import {stringify} from "./format.js";

export function length(x) {
  return typeof x === "number" ? `${x}px` : stringify(x);
}

export function maybeWidth(width) {
  return {"--input-width": length(width)};
}
