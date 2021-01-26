export function arrayify(array) {
  return Array.isArray(array) ? array : Array.from(array);
}
