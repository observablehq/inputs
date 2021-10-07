import * as Inputs from "@observablehq/inputs";
import {html} from "htl";

export async function color() {
  return Inputs.color();
}

export async function colorLabel() {
  return Inputs.color({label: "dollars&pounds"});
}

export async function colorValue() {
  return Inputs.color({value: "#00ff00"});
}

export async function colorSubmit() {
  return Inputs.color({submit: true});
}

export async function colorSubmitCustom() {
  return Inputs.color({submit: "dollars&pounds"});
}

export async function colorSubmitHtml() {
  return Inputs.color({submit: html`<b>Update</b>`});
}

export async function colorWide() {
  return Inputs.color({width: "20em"});
}

export async function colorDatalist() {
  return Inputs.color({datalist: ["#00ff00", "#ff0000", "#0000ff"]});
}

export async function colorDisabled() {
  return Inputs.color({disabled: true});
}

export async function colorReadonly() {
  return Inputs.color({readonly: true});
}
