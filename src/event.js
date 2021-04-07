export const bubbles = {bubbles: true};

export function preventDefault(event) {
  event.preventDefault();
}

export function dispatchInput({currentTarget}) {
  (currentTarget.form || currentTarget).dispatchEvent(new Event("input", bubbles));
}

export function checkValidity(input) {
  return input.checkValidity();
}
