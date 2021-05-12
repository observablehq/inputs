import * as Inputs from "@observablehq/inputs";
import tape from "./jsdom.js";

tape("Inputs.radio([]) handles empty options", test => {
  const r = Inputs.radio([]);
  test.equal(r.value, null);
  r.value = "red";
  test.equal(r.value, null);
});

tape("Inputs.radio([value]) handles singular option", test => {
  const r = Inputs.radio(["red"]);
  test.equal(r.value, null);
  r.value = "blue";
  test.equal(r.value, null);
  r.value = "red";
  test.equal(r.value, "red");
  r.value = "blue"; // ignores invalid value
  test.equal(r.value, "red");
});

// JSDOM doesn’t support Inputs.radioNodeList…
// https://github.com/jsdom/jsdom/issues/2600
tape.skip("Inputs.radio(values) supports value getter and setter", test => {
  const r = Inputs.radio(["red", "blue"]);
  test.equal(r.value, null);
  r.value = "blue";
  test.equal(r.value, "blue");
  r.value = "red";
  test.equal(r.value, "red");
  r.value = "green"; // ignores invalid value
  test.equal(r.value, "red");
});
