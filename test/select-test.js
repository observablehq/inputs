import * as Inputs from "@observablehq/inputs";
import {string} from "./coercible.js";
import tape from "./jsdom.js";

tape("Inputs.select(options) sets the options", test => {
  const s = Inputs.select(["red", "green", "blue"]);
  test.deepEqual(Array.from(s.elements.input.options, o => o.textContent), ["red", "green", "blue"]);
  test.equal(s.value, "red");
  const red = string("red"), green = string("green"), blue = string("blue");
  const c = Inputs.select([red, green, blue]);
  test.deepEqual(Array.from(c.elements.input.options, o => o.textContent), ["red", "green", "blue"]);
  test.equal(c.value, red);
});

tape("Inputs.select(options) formats null as empty by default", test => {
  const s = Inputs.select(["red", null, "blue"], {value: null});
  test.deepEqual(Array.from(s.elements.input.options, o => o.textContent), ["red", "", "blue"]);
  test.equal(s.value, null);
});

tape("Inputs.select(…, {format}) sets the format function", test => {
  const s = Inputs.select(["red", null, "blue"], {format: x => x && x.toUpperCase()});
  test.deepEqual(Array.from(s.elements.input.options, o => o.textContent), ["RED", "", "BLUE"]);
  test.equal(s.value, "red");
});
