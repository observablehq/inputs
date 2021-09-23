import {html} from "htl";
import {maybeWidth} from "./css.js";
import {maybeLabel} from "./label.js";
import {createText} from "./text.js";

export function textarea({
  label,
  placeholder,
  spellcheck,
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
  const input = html`<textarea name=text readonly=${readonly} disabled=${disabled} required=${required} rows=${rows} minlength=${minlength} maxlength=${maxlength} spellcheck=${spellcheck === undefined ? false : spellcheck === null ? null : `${spellcheck}`} placeholder=${placeholder} onkeydown=${onkeydown} style=${{width, fontFamily: monospace ? "var(--monospace, monospace)" : null, resize: resize ? null : "none"}}>`;
  const form = html`<form class="__ns__ __ns__-textarea" style=${maybeWidth(width)}>
    ${maybeLabel(label, input)}<div>
      ${input}
    </div>
  </form>`;
  function onkeydown(event) {
    if (options.submit && event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      return form.onsubmit(event);
    }
  }
  return createText(form, input, options);
}
