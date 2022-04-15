import {html} from "htl";
import {maybeWidth} from "./css.js";
import {maybeDatalist} from "./datalist.js";
import {checkValidity, dispatchInput, preventDefault} from "./event.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

export function createText(form, input, value, {
  validate = checkValidity,
  submit
} = {}, {
  get = (input) => input.value,
  set = (input, value) => input.value = stringify(value),
  same = (input, value) => input.value === value,
  after = (button) => input.after(button)
} = {}) {
  submit = submit === true ? "Submit" : submit || null;
  const button = submit ? html`<button type=submit disabled>${submit}` : null;
  if (submit) after(button);
  set(input, value);
  value = validate(input) ? get(input) : undefined;
  form.addEventListener("submit", onsubmit);
  input.oninput = oninput;
  function update() {
    if (validate(input)) {
      value = get(input);
      return true;
    }
  }
  function onsubmit(event) {
    preventDefault(event);
    if (submit) {
      if (update()) {
        button.disabled = true;
        dispatchInput(event);
      } else {
        input.reportValidity();
      }
    }
  }
  function oninput(event) {
    if (submit) {
      button.disabled = same(input, value);
      event.stopPropagation();
    } else if (!update()) {
      event.stopPropagation();
    }
  }
  return Object.defineProperty(form, "value", {
    get() {
      return value;
    },
    set(v) {
      set(input, v);
      update();
    }
  });
}

export function text({
  label,
  value = "",
  type = "text",
  placeholder,
  pattern,
  spellcheck,
  autocomplete,
  autocapitalize,
  min,
  max,
  minlength,
  maxlength,
  required = minlength > 0,
  datalist,
  readonly,
  disabled,
  width,
  ...options
} = {}) {
  const [list, listId] = maybeDatalist(datalist);
  const input = html`<input
    type=${type}
    name=text
    list=${listId}
    readonly=${readonly}
    disabled=${disabled}
    required=${required}
    min=${min}
    max=${max}
    minlength=${minlength}
    maxlength=${maxlength}
    pattern=${pattern}
    spellcheck=${truefalse(spellcheck)}
    autocomplete=${onoff(autocomplete)}
    autocapitalize=${onoff(autocapitalize)}
    placeholder=${placeholder}
  >`;
  const form = html`<form class=__ns__ style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div class=__ns__-input>
      ${input}
    </div>${list}
  </form>`;
  return createText(form, input, value, options);
}

export function email(options) {
  return text({...options, type: "email"});
}

export function tel(options) {
  return text({...options, type: "tel"});
}

export function url(options) {
  return text({...options, type: "url"});
}

export function password(options) {
  return text({...options, type: "password"});
}

// Hypertext Literal will normally drop an attribute if its value is exactly
// false, but for these attributes (e.g., spellcheck), we actually want the
// false to be stringified as the attribute value.
export function truefalse(value) {
  return value == null ? null : `${value}`;
}

// For boolean attributes that support “on” and “off”, this maps true to “on”
// and false to “off”. Any other value (if not nullish) is assumed to be a
// string, such as autocapitalize=sentences.
export function onoff(value) {
  return value == null ? null : `${value === false ? "off" : value === true ? "on" : value}`;
}
