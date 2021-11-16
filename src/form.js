import {html} from "htl";

export function form(inputs, options) {
  return (Array.isArray(inputs) ? arrayForm : objectForm)(inputs, options);
}

function arrayTemplate(inputs) {
  return html`<div>${inputs}`;
}

function arrayForm(inputs, {template = arrayTemplate} = {}) {
  inputs = [...inputs]; // defensive copy
  let value = inputs.map(({value}) => value);
  return Object.defineProperty(template(inputs), "value", {
    get() {
      for (let i = 0, n = inputs.length; i < n; ++i) {
        const v = inputs[i].value;
        if (!Object.is(v, value[i])) {
          value = [...value];
          value[i] = v;
        }
      }
      return value;
    },
    set(v = []) {
      for (let i = 0, n = inputs.length; i < n; ++i) {
        inputs[i].value = v[i];
      }
    }
  });
}

function objectTemplate(inputs) {
  return html`<div>${Object.values(inputs)}`;
}

function objectForm(inputs, {template = objectTemplate} = {}) {
  inputs = {...inputs}; // defensive copy
  let value = Object.fromEntries(Object.entries(inputs).map(([name, {value}]) => [name, value]));
  return Object.defineProperty(template(inputs), "value", {
    get() {
      for (const k in value) {
        const v = inputs[k].value;
        if (!Object.is(v, value[k])) {
          value = {...value};
          value[k] = v;
        }
      }
      return value;
    },
    set(v = {}) {
      for (const name in inputs) {
        inputs[name].value = v[name];
      }
    }
  });
}
