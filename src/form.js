import {html} from "htl";

export function form(inputs) {
  return (Array.isArray(inputs) ? arrayForm : objectForm)(inputs);
}

function arrayForm(inputs) {
  inputs = [...inputs];
  const oninput = () => form.value = inputs.map(({value}) => value);
  const form = html`<form>${inputs}`;
  form.addEventListener("input", oninput);
  oninput();
  return form;
}

function objectForm(inputs) {
  inputs = Object.entries(inputs);
  const oninput = () => form.value = Object.fromEntries(inputs.map(([name, {value}]) => [name, value]));
  const form = html`<form>${inputs.map(([, input]) => input)}`;
  form.addEventListener("input", oninput);
  oninput();
  return form;
}
