import assert from "node:assert";
import * as Inputs from "../src/index.js";
import {string} from "./coercible.js";
import it from "./jsdom.js";

it("Inputs.select(options) sets the options", () => {
  const s = Inputs.select(["red", "green", "blue"]);
  assert.deepStrictEqual(Array.from(s.elements.input.options, o => o.textContent), ["red", "green", "blue"]);
  assert.strictEqual(s.value, "red");
  const red = string("red"), green = string("green"), blue = string("blue");
  const c = Inputs.select([red, green, blue]);
  assert.deepStrictEqual(Array.from(c.elements.input.options, o => o.textContent), ["red", "green", "blue"]);
  assert.strictEqual(c.value, red);
});

it("Inputs.select(options) formats null as empty by default", () => {
  const s = Inputs.select(["red", null, "blue"], {value: null});
  assert.deepStrictEqual(Array.from(s.elements.input.options, o => o.textContent), ["red", "", "blue"]);
  assert.strictEqual(s.value, null);
});

it("Inputs.select(…, {format}) sets the format function", () => {
  const s = Inputs.select(["red", null, "blue"], {format: x => x && x.toUpperCase()});
  assert.deepStrictEqual(Array.from(s.elements.input.options, o => o.textContent), ["RED", "", "BLUE"]);
  assert.strictEqual(s.value, "red");
});
