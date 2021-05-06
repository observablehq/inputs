import * as Inputs from "@observablehq/inputs";
import {html} from "htl";
import {number, string} from "./coercible.js";
import tape from "./jsdom.js";

tape("Inputs.range([min, max]) sets the min and max", test => {
  const r = Inputs.range([0, 100]);
  test.equal(r.elements.range.min, "0");
  test.equal(r.elements.range.max, "100");
  const s = Inputs.range([number(0), number(100)]);
  test.equal(s.elements.range.min, "0");
  test.equal(s.elements.range.max, "100");
});

// JSDOM does not implement inputs correctly…
tape.skip("Inputs.range([min, max]) sets the initial value to (min + max) / 2", test => {
  test.equal(Inputs.range([0, 1]).value, 0.5);
  test.equal(Inputs.range([20, 40]).value, 30);
});

tape("Inputs.range() is equivalent to Inputs.range([0, 1])", test => {
  const r = Inputs.range();
  // test.equal(r.value, 0.5); // JSDOM
  test.equal(r.elements.range.min, "0");
  test.equal(r.elements.range.max, "1");
  test.equal(r.elements.range.step, "any");
});

tape("Inputs.range(…, {label}) sets the label", test => {
  test.equal(Inputs.range([0, 1], {label: "foo"}).textContent.trim(), "foo");
  test.equal(Inputs.range([0, 100], {label: "bar"}).textContent.trim(), "bar");
  test.equal(Inputs.range([0, 100], {label: html`<b>bar</b>`}).textContent.trim(), "bar");
});

tape("Inputs.range(…, {format}) sets the format", test => {
  // test.equal(Inputs.range([0, 1], {format: d => d.toFixed(4)}).elements.number.value, "0.5000"); // JSDOM
  test.throws(() => Inputs.range([0, 1], {format: "foo"}), TypeError);
});

tape("Inputs.range(…, {step}) sets the step", test => {
  test.equal(Inputs.range([0, 100], {step: 10}).elements.range.step, "10");
  test.equal(Inputs.range([0, 100], {step: undefined}).elements.range.step, "any");
  test.equal(Inputs.range([0, 100], {step: number(10)}).elements.range.step, "10");
});

// JSDOM does not implement inputs correctly…
tape.skip("Inputs.range(…, {step}) affects the initial value", test => {
  const r = Inputs.range([0, 100], {step: 7}); // 50 is not a multiple of 7
  test.equal(r.elements.range.value, "49");
  test.equal(r.value, 49);
});

tape("Inputs.range(…, {value}) sets the initial value", test => {
  const r = Inputs.range([0, 100], {value: 10});
  test.equal(r.value, 10);
  test.equal(r.elements.range.valueAsNumber, 10);
  test.equal(r.elements.number.value, "10");
  const s = Inputs.range([0, 100], {value: string("10")});
  test.equal(s.value, 10);
  test.equal(s.elements.range.valueAsNumber, 10);
  test.equal(s.elements.number.value, "10");
});
