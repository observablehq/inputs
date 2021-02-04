export function Input(value) {
  const input = new EventTarget();
  input.value = value;
  return input;
}
