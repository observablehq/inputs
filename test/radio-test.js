import {Radio} from "@observablehq/inputs";
import tape from "./jsdom.js";

tape("Radio([]) handles empty options", test => {
  const r = Radio([]);
  test.equal(r.value, null);
  r.value = "red";
  test.equal(r.value, null);
});

tape("Radio([value]) handles singular option", test => {
  const r = Radio(["red"]);
  test.equal(r.value, null);
  r.value = "blue";
  test.equal(r.value, null);
  r.value = "red";
  test.equal(r.value, "red");
  r.value = "blue"; // ignores invalid value
  test.equal(r.value, "red");
});

// JSDOM doesn’t support RadioNodeList…
// https://github.com/jsdom/jsdom/issues/2600
tape.skip("Radio(values) supports value getter and setter", test => {
  const r = Radio(["red", "blue"]);
  test.equal(r.value, null);
  r.value = "blue";
  test.equal(r.value, "blue");
  r.value = "red";
  test.equal(r.value, "red");
  r.value = "green"; // ignores invalid value
  test.equal(r.value, "red");
});
