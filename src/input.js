export function input(value) {
  const target = new EventTarget();
  target.value = value;
  return target;
}
