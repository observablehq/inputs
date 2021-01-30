import {html} from "htl";
import {createChooser} from "./chooser.js";
import {maybeLabel} from "./label.js";

export const Radio = createChooser({
  render(data, keys, selection, {format = d => d, multiple, label, style: {...formStyle} = {}}) {
    if (typeof format !== "function") throw new TypeError("format is not a function");
    const form = html`<form class=__ns__ style=${formStyle}>
    ${maybeLabel(label)}<div>
      ${keys.map(([key, i]) => html`<label><input type=${multiple ? "checkbox" : "radio"} name="input" value=${i} checked=${selection.has(i)}>${format(key, i, data)}`)}
    </div>
  </form>`;
    return [form, inputof(form.elements.input, multiple)];
  },
  selectedIndexes(input) {
    return Array.from(input).filter(i => i.checked).map(i => +i.value);
  },
  select(input, selected) {
    input.checked = selected;
  }
});

// The input is undefined if there are no options, or an individual input
// element if there is only one; we want these two cases to behave the same as
// when there are two or more options, i.e., a RadioNodeList.
function inputof(input, multiple) {
  return input === undefined ? new (multiple ? MultipleOptionZero : OptionZero)()
    : typeof input.length === "undefined" ? new (multiple ? MultipleOptionOne : OptionOne)(input)
    : input;
}

class OptionZero {
  get value() {
    return null;
  }
  set value(v) {
    // ignore
  }
  *[Symbol.iterator]() {
    // empty
  }
}

class MultipleOptionZero {
  constructor() {
    const value = [];
    Object.defineProperty(this, "value", {
      get: () => value,
      set: () => {} // ignore
    });
  }
  *[Symbol.iterator]() {
    // empty
  }
}

// TODO If we allow selected radios to be cleared by command-clicking, then
// assigning a radio’s value programmatically should also clear the selection.
// This will require changing this class and also wrapping RadioNodeList in the
// common case to change the value setter’s behavior.
class OptionOne {
  constructor(input) {
    this._input = input;
  }
  get value() {
    const {_input} = this;
    return _input.checked ? _input.value : ""
  }
  set value(v) {
    const {_input} = this;
    _input.checked = _input.checked || (v + "") === _input.value;
  }
  *[Symbol.iterator]() {
    yield this._input;
  }
}

class MultipleOptionOne {
  constructor(input) {
    this._input = input;
    this._value = input.checked ? [input.value] : [];
  }
  get value() {
    return this._value;
  }
  set value(v) {
    const {_input} = this;
    const checked = _input.checked || (v + "") === _input.value;
    if (checked === _input.checked) return;
    this._value = checked ? [_input.value] : [];
  }
  *[Symbol.iterator]() {
    yield this._input;
  }
}
