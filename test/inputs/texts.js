import {html} from "htl";
import * as Inputs from "../../src/index.js";

export async function text() {
  return Inputs.text();
}

export async function textLabel() {
  return Inputs.text({label: "dollars&pounds"});
}

export async function textLabelHtml() {
  return Inputs.text({label: html`<b>intensity</b>`});
}

export async function textValue() {
  return Inputs.text({value: "hello world"});
}

export async function textPlaceholder() {
  return Inputs.text({placeholder: "hello world"});
}

export async function textSpellcheckFalse() {
  return Inputs.text({spellcheck: false});
}

export async function textSubmit() {
  return Inputs.text({submit: true});
}

export async function textSubmitCustom() {
  return Inputs.text({submit: "dollars&pounds"});
}

export async function textSubmitHtml() {
  return Inputs.text({submit: html`<b>Update</b>`});
}

export async function textWide() {
  return Inputs.text({width: "20em"});
}

export async function textMinlength() {
  return Inputs.text({minlength: 10});
}

export async function textMaxlength() {
  return Inputs.text({maxlength: 10});
}

export async function textDatalist() {
  return Inputs.text({datalist: ["red", "green", "blue"]});
}

export async function textDisabled() {
  return Inputs.text({disabled: true});
}

export async function textReadonly() {
  return Inputs.text({readonly: true});
}

export async function password() {
  return Inputs.password();
}

export async function email() {
  return Inputs.email();
}

export async function tel() {
  return Inputs.tel();
}

export async function url() {
  return Inputs.url();
}

export async function textDate() {
  return Inputs.text({type: "date"});
}
