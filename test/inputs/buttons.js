import {Button} from "@observablehq/inputs";
import {html} from "htl";

export async function button() {
  return Button();
}

export async function buttonContent() {
  return Button("dollars&pounds");
}

export async function buttonContentHtml() {
  return Button(html.fragment`<b>Click</b> me`);
}

export async function buttonLabel() {
  return Button("OK", {label: "dollars&pounds"});
}

export async function buttonLabelHtml() {
  return Button("OK", {label: html`<b>intensity</b>`});
}

export async function buttonDisabled() {
  return Button("OK", {disabled: true});
}

export async function buttonWidth() {
  return Button("OK", {width: "20em"});
}
