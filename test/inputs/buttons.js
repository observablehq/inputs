import {html} from "htl";
import * as Inputs from "../../src/index.js";

export async function button() {
  return Inputs.button();
}

export async function buttonContent() {
  return Inputs.button("dollars&pounds");
}

export async function buttonContentHtml() {
  return Inputs.button(html.fragment`<b>Click</b> me`);
}

export async function buttonLabel() {
  return Inputs.button("OK", {label: "dollars&pounds"});
}

export async function buttonLabelHtml() {
  return Inputs.button("OK", {label: html`<b>intensity</b>`});
}

export async function buttonDisabled() {
  return Inputs.button("OK", {disabled: true});
}

export async function buttonWidth() {
  return Inputs.button("OK", {width: "20em"});
}
