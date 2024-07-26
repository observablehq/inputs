import * as Inputs from "../../src/index.js";

export async function date() {
  return Inputs.date();
}

export async function dateLabel() {
  return Inputs.date({label: "dollars&pounds"});
}

export async function dateValue() {
  return Inputs.date({value: new Date("2021-01-01")});
}

export async function datetime() {
  return Inputs.datetime();
}

export async function datetimeLabel() {
  return Inputs.datetime({label: "Start"});
}

export async function datetimeValue() {
  return Inputs.datetime({value: new Date("2021-01-01T02:30")});
}
