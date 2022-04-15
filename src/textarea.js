import {html} from "htl";
import {maybeWidth} from "./css.js";
import {bubbles} from "./event.js";
import {maybeLabel} from "./label.js";
import {createText, onoff, truefalse} from "./text.js";

export function textarea({
  value = "",
  label,
  placeholder,
  spellcheck,
  autocomplete,
  autocapitalize,
  rows = 3,
  minlength,
  maxlength,
  required = minlength > 0,
  readonly,
  disabled,
  monospace = false,
  resize = rows < 12,
  width,
  ...options
} = {}) {
  const input = html`<textarea
    name=text
    readonly=${readonly}
    disabled=${disabled}
    required=${required}
    rows=${rows}
    minlength=${minlength}
    maxlength=${maxlength}
    spellcheck=${truefalse(spellcheck)}
    autocomplete=${onoff(autocomplete)}
    autocapitalize=${onoff(autocapitalize)}
    placeholder=${placeholder}
    onkeydown=${onkeydown}
    style=${{
      width,
      fontFamily: monospace ? "var(--monospace, monospace)" : null,
      resize: resize ? null : "none"
    }}
  >`;
  const form = html`<form class="__ns__ __ns__-textarea" style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div>
      ${input}
    </div>
  </form>`;
  function onkeydown(event) {
    if (options.submit && event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      return form.dispatchEvent(new Event("submit", bubbles));
    }
  }
  return createText(form, input, value, options);
}
