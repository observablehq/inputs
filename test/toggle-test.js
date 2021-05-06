import * as Inputs from "@observablehq/inputs";
import tape from "./jsdom.js";

tape("Inputs.toggle({values}) handles custom values", test => {
  const t = Inputs.toggle({values: [1, 0]});
  test.equal(t.value, 0);
  test.equal(t.elements.input.checked, false);
  t.value = 1;
  test.equal(t.value, 1);
  test.equal(t.elements.input.checked, true);
  t.value = 0;
  test.equal(t.value, 0);
  test.equal(t.elements.input.checked, false);
});
