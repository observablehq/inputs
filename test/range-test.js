import assert from "node:assert";
import {html} from "htl";
import * as Inputs from "../src/index.js";
import {number, string} from "./coercible.js";
import it from "./jsdom.js";

it("Inputs.range([min, max]) sets the min and max", () => {
  const r = Inputs.range([0, 100]);
  assert.strictEqual(r.elements.range.min, "0");
  assert.strictEqual(r.elements.range.max, "100");
  const s = Inputs.range([number(0), number(100)]);
  assert.strictEqual(s.elements.range.min, "0");
  assert.strictEqual(s.elements.range.max, "100");
});

// JSDOM does not implement inputs correctly…
it.skip("Inputs.range([min, max]) sets the initial value to (min + max) / 2", () => {
  assert.strictEqual(Inputs.range([0, 1]).value, 0.5);
  assert.strictEqual(Inputs.range([20, 40]).value, 30);
});

it("Inputs.range() is equivalent to Inputs.range([0, 1])", () => {
  const r = Inputs.range();
  // assert.strictEqual(r.value, 0.5); // JSDOM
  assert.strictEqual(r.elements.range.min, "0");
  assert.strictEqual(r.elements.range.max, "1");
  assert.strictEqual(r.elements.range.step, "any");
});

it("Inputs.range(…, {label}) sets the label", () => {
  assert.strictEqual(Inputs.range([0, 1], {label: "foo"}).textContent.trim(), "foo");
  assert.strictEqual(Inputs.range([0, 100], {label: "bar"}).textContent.trim(), "bar");
  assert.strictEqual(Inputs.range([0, 100], {label: html`<b>bar</b>`}).textContent.trim(), "bar");
});

it("Inputs.range(…, {format}) sets the format", () => {
  // assert.strictEqual(Inputs.range([0, 1], {format: d => d.toFixed(4)}).elements.number.value, "0.5000"); // JSDOM
  assert.throws(() => Inputs.range([0, 1], {format: "foo"}), TypeError);
});

it("Inputs.range(…, {step}) sets the step", () => {
  assert.strictEqual(Inputs.range([0, 100], {step: 10}).elements.range.step, "10");
  assert.strictEqual(Inputs.range([0, 100], {step: undefined}).elements.range.step, "any");
  assert.strictEqual(Inputs.range([0, 100], {step: number(10)}).elements.range.step, "10");
});

// JSDOM does not implement inputs correctly…
it.skip("Inputs.range(…, {step}) affects the initial value", () => {
  const r = Inputs.range([0, 100], {step: 7}); // 50 is not a multiple of 7
  assert.strictEqual(r.elements.range.value, "49");
  assert.strictEqual(r.value, 49);
});

it("Inputs.range(…, {value}) sets the initial value", () => {
  const r = Inputs.range([0, 100], {value: 10});
  assert.strictEqual(r.value, 10);
  assert.strictEqual(r.elements.range.valueAsNumber, 10);
  assert.strictEqual(r.elements.number.value, "10");
  const s = Inputs.range([0, 100], {value: string("10")});
  assert.strictEqual(s.value, 10);
  assert.strictEqual(s.elements.range.valueAsNumber, 10);
  assert.strictEqual(s.elements.number.value, "10");
});
