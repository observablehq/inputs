import {html} from "htl";

export function form(inputs) {
  return (Array.isArray(inputs) ? arrayForm : objectForm)(inputs);
}

function arrayForm(inputs) {
  inputs = [...inputs]; // defensive copy
  let value; // lazily constructed
  const form = html`<form>${inputs}`;
  form.addEventListener("input", () => value = undefined);
  return Object.defineProperty(form, "value", {
    get() {
      return value === undefined
        ? (value = inputs.map(({value}) => value))
        : value;
    },
    set(v = []) {
      value = undefined;
      for (let i = 0, n = inputs.length; i < n; ++i) {
        inputs[i].value = v[i];
      }
    }
  });
}

function objectForm(inputs) {
  inputs = {...inputs}; // defensive copy
  let value; // lazily constructed
  const form = html`<form>${Object.values(inputs)}`;
  form.addEventListener("input", () => value = undefined);
  return Object.defineProperty(form, "value", {
    get() {
      return value === undefined
        ? (value = Object.fromEntries(Object.entries(inputs).map(([name, {value}]) => [name, value])))
        : value;
    },
    set(v = {}) {
      value = undefined;
      for (const name in inputs) {
        inputs[name].value = v[name];
      }
    }
  });
}
