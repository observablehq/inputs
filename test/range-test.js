import {Range} from "@observablehq/inputs";
import tape from "./jsdom.js";

tape("Range([min, max]) sets the initial value to (min + max) / 2", test => {
  test.equal(Range([0, 1]).value, 0.5);
  test.equal(Range([20, 40]).value, 30);
});

tape("Range() is equivalent to Range([0, 1])", test => {
  const r = Range();
  test.equal(r.value, 0.5);
  test.equal(r.elements.input.min, "0");
  test.equal(r.elements.input.max, "1");
  test.equal(r.elements.input.step, "any");
});

tape("Range(…, {label}) sets the label", test => {
  test.equal(Range([0, 1], {label: "foo"}).elements.output.value, "0.5 foo");
  test.equal(Range([0, 100], {label: "bar"}).elements.output.value, "50 bar");
});

tape("Range(…, {format}) sets the format", test => {
  test.equal(Range([0, 1], {format: d => d.toFixed(4)}).elements.output.value, "0.5000");
});

tape("Range(…, {step}) sets the step", test => {
  test.equal(Range([0, 100], {step: 10}).elements.input.step, "10");
});

tape("Range(…, {step}) does not affect the initial value", test => {
  const r = Range([0, 100], {step: 7}); // 50 is not a multiple of 7
  test.equal(r.elements.input.value, "50");
  test.equal(r.value, 50);
});

tape("Range(…, {value}) sets the initial value", test => {
  const r = Range([0, 100], {value: 10});
  test.equal(r.value, 10);
  test.equal(r.elements.input.valueAsNumber, 10);
  test.equal(r.elements.output.value, "10");
});

tape("Range(…, {value}) coerces the initial value to a number", test => {
  const r = Range([0, 100], {value: "10"});
  test.equal(r.value, 10);
  test.equal(r.elements.input.valueAsNumber, 10);
  test.equal(r.elements.output.value, "10");
});

tape("Range(…, {value}) coerces the step to a number, if not undefined", test => {
  test.equal(Range([0, 100], {step: undefined}).elements.input.step, "any");
  test.equal(Range([0, 100], {step: "10"}).elements.input.step, "10");
});

tape("Range([min, max]) coerces the min and max to numbers", test => {
  const r = Range(["0", "100"]);
  test.equal(r.value, 50);
  test.equal(r.elements.input.min, "0");
  test.equal(r.elements.input.max, "100");
});
