import assert from "node:assert";
import * as Inputs from "../src/index.js";
import it from "./jsdom.js";

it("Inputs.checkbox([]) handles empty options", () => {
  const r = Inputs.checkbox([]);
  assert.deepStrictEqual(r.value, []);
  assert.strictEqual(r.value, r.value);
  r.value = ["red"];
  assert.deepStrictEqual(r.value, []);
  assert.strictEqual(r.value, r.value);
});

it("Inputs.checkbox([value]) handles singular option", () => {
  const r = Inputs.checkbox(["red"]);
  assert.deepStrictEqual(r.value, []);
  assert.strictEqual(r.value, r.value);
  r.value = ["blue"];
  assert.deepStrictEqual(r.value, []);
  r.value = ["red"];
  assert.deepStrictEqual(r.value, ["red"]);
  assert.strictEqual(r.value, r.value);
  r.value = ["blue"];
  assert.deepStrictEqual(r.value, []);
});
