import * as Inputs from "@observablehq/inputs";
import {html} from "htl";

export async function textarea() {
  return Inputs.textarea();
}

export async function textareaLabel() {
  return Inputs.textarea({label: "dollars&pounds"});
}

export async function textareaLabelHtml() {
  return Inputs.textarea({label: html`<b>intensity</b>`});
}

export async function textareaValue() {
  return Inputs.textarea({value: "hello world"});
}

export async function textareaValueDanger() {
  return Inputs.textarea({value: "hello world </textarea>"});
}

export async function textareaPlaceholder() {
  return Inputs.textarea({placeholder: "hello world"});
}

export async function textareaSpellcheckFalse() {
  return Inputs.textarea({spellcheck: false});
}

export async function textareaSubmit() {
  return Inputs.textarea({submit: true});
}

export async function textareaSubmitCustom() {
  return Inputs.textarea({submit: "dollars&pounds"});
}

export async function textareaSubmitHtml() {
  return Inputs.textarea({submit: html`<b>Update</b>`});
}

export async function textareaWide() {
  return Inputs.textarea({width: "20em"});
}

export async function textareaCols() {
  return Inputs.textarea({cols: 80});
}

export async function textareaColsWidth() {
  return Inputs.textarea({cols: 80, width: 500});
}

export async function textareaRows() {
  return Inputs.textarea({rows: 20});
}

export async function textareaMinlength() {
  return Inputs.textarea({minlength: 10});
}

export async function textareaMaxlength() {
  return Inputs.textarea({maxlength: 10});
}

export async function textareaResize() {
  return Inputs.textarea({resize: false});
}

export async function textareaDisabled() {
  return Inputs.textarea({disabled: true});
}

export async function textareaReadonly() {
  return Inputs.textarea({readonly: true});
}
