import {AutoSelect, Select} from "@observablehq/inputs";
import {string} from "./coercible.js";
import tape from "./jsdom.js";

tape("Select(options) sets the options", test => {
  const s = Select(["red", "green", "blue"]);
  test.deepEqual(Array.from(s.elements.input.options, o => o.value), ["red", "green", "blue"]);
  test.equal(s.value, "red");
  const red = string("red"), green = string("green"), blue = string("blue");
  const c = Select([red, green, blue]);
  test.deepEqual(Array.from(c.elements.input.options, o => o.value), ["red", "green", "blue"]);
  test.equal(c.value, red);
});

tape("Select(options) formats null as empty by default", test => {
  const s = Select(["red", null, "blue"], {value: null});
  test.deepEqual(Array.from(s.elements.input.options, o => o.value), ["red", "", "blue"]);
  test.equal(s.value, null);
});

tape("Select(…, {format}) sets the format function", test => {
  const s = Select(["red", null, "blue"], {format: x => x && x.toUpperCase()});
  test.deepEqual(Array.from(s.elements.input.options, o => o.value), ["RED", "", "BLUE"]);
  test.equal(s.value, "red");
});

tape("AutoSelect(options, {format}) deduplicates formatted options", test => {
  const s = AutoSelect(["Red", "rEd", "reD", "blue"], {format: s => s.toLowerCase(), value: "red"});
  test.deepEqual(Array.from(s.querySelector("datalist").options, o => o.value), ["red", "blue"]);
  test.equal(s.value, "Red"); // the first one wins
});
