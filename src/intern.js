export function intern(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}
