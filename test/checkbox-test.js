import {Checkbox} from "@observablehq/inputs";
import tape from "./jsdom.js";

tape("Checkbox([]) handles empty options", test => {
  const r = Checkbox([]);
  test.deepEqual(r.value, []);
  test.strictEqual(r.value, r.value);
  r.value = ["red"];
  test.deepEqual(r.value, []);
  test.strictEqual(r.value, r.value);
});

tape("Checkbox([value]) handles singular option", test => {
  const r = Checkbox(["red"]);
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
