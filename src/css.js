export function length(x) {
  return x == null ? null : typeof x === "number" ? `${x}px` : `${x}`;
}

export function maybeWidth(width) {
  return {"--input-width": length(width)};
}
