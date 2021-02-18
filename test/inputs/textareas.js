import {Textarea} from "@observablehq/inputs";
import {html} from "htl";

export async function textarea() {
  return Textarea();
}

export async function textareaLabel() {
  return Textarea({label: "dollars&pounds"});
}

export async function textareaLabelHtml() {
  return Textarea({label: html`<b>intensity</b>`});
}

export async function textareaValue() {
  return Textarea({value: "hello world"});
}

export async function textareaValueDanger() {
  return Textarea({value: "hello world </textarea>"});
}

export async function textareaPlaceholder() {
  return Textarea({placeholder: "hello world"});
}

export async function textareaSpellcheckFalse() {
  return Textarea({spellcheck: false});
}

export async function textareaSubmit() {
  return Textarea({submit: true});
}

export async function textareaSubmitCustom() {
  return Textarea({submit: "dollars&pounds"});
}

export async function textareaSubmitHtml() {
  return Textarea({submit: html`<b>Update</b>`});
}

export async function textareaWide() {
  return Textarea({width: "20em"});
}

export async function textareaCols() {
  return Textarea({cols: 80});
}

export async function textareaColsWidth() {
  return Textarea({cols: 80, width: 500});
}

export async function textareaRows() {
  return Textarea({rows: 20});
}

export async function textareaMinlength() {
  return Textarea({minlength: 10});
}

export async function textareaMaxlength() {
  return Textarea({maxlength: 10});
}

export async function textareaReadonly() {
  return Textarea({readonly: true});
}

export async function textareaResize() {
  return Textarea({resize: false});
}

export async function textareaDisabled() {
  return Textarea({disabled: true});
}

