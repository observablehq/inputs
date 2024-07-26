import {html} from "htl";
import {maybeWidth} from "./css.js";
import {maybeLabel} from "./label.js";
import {createText} from "./text.js";

export function fileOf(AbstractFile) {

  class LocalFile extends AbstractFile {
    constructor(file) {
      super(file.name, file.type, file.lastModified);
      Object.defineProperty(this, "_", {value: file});
      Object.defineProperty(this, "_url", {writable: true});
    }
    async url() {
      return this._url || (this._url = URL.createObjectURL(this._));
    }
    async blob() {
      return this._;
    }
    async stream() {
      return this._.stream();
    }
  }

  return function file({
    label,
    required,
    accept,
    capture,
    multiple,
    disabled,
    width,
    value, // eslint-disable-line no-unused-vars
    submit, // eslint-disable-line no-unused-vars
    ...options
  } = {}) {
    const input = html`<input
      type=file
      name=file
      disabled=${disabled}
      required=${required}
      accept=${accept}
      capture=${capture}
      multiple=${multiple}
    >`;
    const form = html`<form class=__ns__ style=${maybeWidth(width)}>
      ${maybeLabel(label, input)}<div class=__ns__-input>
        ${input}
      </div>
    </form>`;
    return createText(form, input, undefined, options, {
      get: (input) => multiple ? Array.from(input.files, file => new LocalFile(file))
        : input.files.length ? new LocalFile(input.files[0])
        : null,
      set: () => {}, // ignored
      same: () => false // ignored
    });
  };
}
