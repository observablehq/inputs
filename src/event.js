export function preventDefault(event) {
  event.preventDefault();
}

export function dispatchInput({currentTarget}) {
  (currentTarget.form || currentTarget).dispatchEvent(new CustomEvent("input"));
}
