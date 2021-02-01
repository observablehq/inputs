import {Text} from "@observablehq/inputs";
import {html} from "htl";

export async function text() {
  return Text();
}

export async function textLabel() {
  return Text({label: "dollars&pounds"});
}

export async function textLabelHtml() {
  return Text({label: html`<b>intensity</b>`});
}

export async function textValue() {
  return Text({value: "hello world"});
}

export async function textPlaceholder() {
  return Text({placeholder: "hello world"});
}

export async function textSpellcheckFalse() {
  return Text({spellcheck: false});
}

export async function textSubmit() {
  return Text({submit: true});
}

export async function textSubmitCustom() {
  return Text({submit: "dollars&pounds"});
}

export async function textSubmitHtml() {
  return Text({submit: html`<b>Update</b>`});
}

export async function textWide() {
  return Text({width: "20em"});
}

export async function textMinlength() {
  return Text({minlength: 10});
}

export async function textMaxlength() {
  return Text({maxlength: 10});
}

export async function textDatalist() {
  return Text({datalist: ["red", "green", "blue"]});
}

export async function textDisabled() {
  return Text({disabled: true});
}
