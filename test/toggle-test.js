import * as Inputs from "../src/index.js";
import assert from "assert";
import it from "./jsdom.js";

it("Inputs.toggle({values}) handles custom values", () => {
  const t = Inputs.toggle({values: [1, 0]});
  assert.strictEqual(t.value, 0);
  assert.strictEqual(t.elements.input.checked, false);
  t.value = 1;
  assert.strictEqual(t.value, 1);
  assert.strictEqual(t.elements.input.checked, true);
  t.value = 0;
  assert.strictEqual(t.value, 0);
  assert.strictEqual(t.elements.input.checked, false);
});
