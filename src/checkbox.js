import {html} from "htl";
import {createChooser} from "./chooser.js";
import {stringify} from "./format.js";
import {maybeLabel} from "./label.js";

function createCheckbox(multiple, type) {
  return createChooser({
    multiple,
    render(data, index, selected, disabled, {format, label}) {
      const form = html`<form class="__ns__ __ns__-checkbox">
      ${maybeLabel(label)}<div>
        ${index.map(i => html`<label><input type=${type} disabled=${typeof disabled === "function" ? disabled(i) : disabled} name=input value=${i} checked=${selected(i)}>${format(data[i], i, data)}`)}
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
}

export const radio = createCheckbox(false, "radio");

export const checkbox = createCheckbox(true, "checkbox");

export function toggle({label, value, values, disabled} = {}) {
  const input = html`<input class=__ns__-input type=checkbox name=input disabled=${disabled}>`;
  const form = html`<form class="__ns__ __ns__-toggle">${maybeLabel(label, input)}${input}`;
  Object.defineProperty(form, "value", {
    get() {
      return values === undefined ? input.checked : values[input.checked ? 0 : 1];
    },
    set(v) {
      input.checked = values === undefined ? !!v : v === values[0];
    }
  });
  if (value !== undefined) form.value = value;
  return form;
}

// The input is undefined if there are no options, or an individual input
// element if there is only one; we want these two cases to behave the same as
// when there are two or more options, i.e., a RadioNodeList.
function inputof(input, multiple) {
  return input === undefined ? new OptionZero(multiple ? [] : null)
    : typeof input.length === "undefined" ? new (multiple ? MultipleOptionOne : OptionOne)(input)
    : input;
}

class OptionZero {
  constructor(value) {
    this._value = value;
  }
  get value() {
    return this._value;
  }
  set value(v) {
    // ignore
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
    return _input.checked ? _input.value : "";
  }
  set value(v) {
    const {_input} = this;
    if (_input.checked) return;
    _input.checked = stringify(v) === _input.value;
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
    if (_input.checked) return;
    _input.checked = stringify(v) === _input.value;
    this._value = _input.checked ? [_input.value] : [];
  }
  *[Symbol.iterator]() {
    yield this._input;
  }
}
