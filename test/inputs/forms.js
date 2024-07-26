import * as Inputs from "../../src/index.js";

export async function formArray() {
  return Inputs.form([
    Inputs.range([0, 255], {step: 1, label: "r"}),
    Inputs.range([0, 255], {step: 1, label: "g"}),
    Inputs.range([0, 255], {step: 1, label: "b"})
  ]);
}

export async function formObject() {
  return Inputs.form({
    r: Inputs.range([0, 255], {step: 1, label: "r"}),
    g: Inputs.range([0, 255], {step: 1, label: "g"}),
    b: Inputs.range([0, 255], {step: 1, label: "b"})
  });
}
