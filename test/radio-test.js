import * as Inputs from "@observablehq/inputs";
import assert from "assert";
import it from "./jsdom.js";

it("Inputs.radio([]) handles empty options", () => {
  const r = Inputs.radio([]);
  assert.strictEqual(r.value, null);
  r.value = "red";
  assert.strictEqual(r.value, null);
});

it("Inputs.radio([value]) handles singular option", () => {
  const r = Inputs.radio(["red"]);
  assert.strictEqual(r.value, null);
  r.value = "blue";
  assert.strictEqual(r.value, null);
  r.value = "red";
  assert.strictEqual(r.value, "red");
  r.value = "blue"; // ignores invalid value
  assert.strictEqual(r.value, "red");
});

// JSDOM doesn’t support Inputs.radioNodeList…
// https://github.com/jsdom/jsdom/issues/2600
it.skip("Inputs.radio(values) supports value getter and setter", () => {
  const r = Inputs.radio(["red", "blue"]);
  assert.strictEqual(r.value, null);
  r.value = "blue";
  assert.strictEqual(r.value, "blue");
  r.value = "red";
  assert.strictEqual(r.value, "red");
  r.value = "green"; // ignores invalid value
  assert.strictEqual(r.value, "red");
});
