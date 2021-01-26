import {Range} from "@observablehq/inputs";
import {html} from "htl";
import {number, string} from "./coercible.js";
import tape from "./jsdom.js";

tape("Range([min, max]) sets the min and max", test => {
  const r = Range([0, 100]);
  test.equal(r.elements.input.min, "0");
  test.equal(r.elements.input.max, "100");
  const s = Range([number(0), number(100)]);
  test.equal(s.elements.input.min, "0");
  test.equal(s.elements.input.max, "100");
});

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
  test.equal(Range([0, 1], {label: "foo"}).textContent.trim(), "0.5foo");
  test.equal(Range([0, 100], {label: "bar"}).textContent.trim(), "50bar");
  test.equal(Range([0, 100], {label: html`<b>bar</b>`}).textContent.trim(), "50bar");
});

tape("Range(…, {format}) sets the format", test => {
  test.equal(Range([0, 1], {format: d => d.toFixed(4)}).textContent.trim(), "0.5000");
  test.throws(() => Range([0, 1], {format: "foo"}), TypeError);
});

tape("Range(…, {step}) sets the step", test => {
  test.equal(Range([0, 100], {step: 10}).elements.input.step, "10");
  test.equal(Range([0, 100], {step: undefined}).elements.input.step, "any");
  test.equal(Range([0, 100], {step: number(10)}).elements.input.step, "10");
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
  test.equal(r.textContent.trim(), "10");
  const s = Range([0, 100], {value: string("10")});
  test.equal(s.value, 10);
  test.equal(s.elements.input.valueAsNumber, 10);
  test.equal(s.textContent.trim(), "10");
});

tape("Range(…, {style}) applies additional styles", test => {
  test.equal(Range([0, 100], {style: {}}).elements.input.style.width, "180px");
  test.equal(Range([0, 100], {style: {width: "240px"}}).elements.input.style.width, "240px");
});
