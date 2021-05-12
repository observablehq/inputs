import * as Inputs from "@observablehq/inputs";
import tape from "./jsdom.js";

tape("Inputs.checkbox([]) handles empty options", test => {
  const r = Inputs.checkbox([]);
  test.deepEqual(r.value, []);
  test.strictEqual(r.value, r.value);
  r.value = ["red"];
  test.deepEqual(r.value, []);
  test.strictEqual(r.value, r.value);
});

tape("Inputs.checkbox([value]) handles singular option", test => {
  const r = Inputs.checkbox(["red"]);
  test.deepEqual(r.value, []);
  test.strictEqual(r.value, r.value);
  r.value = ["blue"];
  test.deepEqual(r.value, []);
  r.value = ["red"];
  test.deepEqual(r.value, ["red"]);
  test.strictEqual(r.value, r.value);
  r.value = ["blue"];
  test.deepEqual(r.value, []);
});
