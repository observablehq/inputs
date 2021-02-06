import {Toggle} from "@observablehq/inputs";
import tape from "./jsdom.js";

tape("Toggle({values}) handles custom values", test => {
  const t = Toggle({values: [1, 0]});
  test.equal(t.value, 0);
  test.equal(t.elements.input.checked, false);
  t.value = 1;
  test.equal(t.value, 1);
  test.equal(t.elements.input.checked, true);
  t.value = 0;
  test.equal(t.value, 0);
  test.equal(t.elements.input.checked, false);
});
