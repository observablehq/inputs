import * as Inputs from "@observablehq/inputs";
import assert from "assert";
import it from "./jsdom.js";

it("Inputs.text() test  initial value is set to ''", () => {
  const t = Inputs.text();
  assert.strictEqual(t.value, "");
});

it("Inputs.text() test setting various text properties ", () => {
  const t = Inputs.text({type: "password", label: "Name", placeholder: "Enter your name", value: "Anonymous"});
  assert.strictEqual(t.value, "Anonymous");
  assert.strictEqual(t.textContent.trim(), "Name");
  assert.strictEqual(t.elements.text.placeholder, "Enter your name");
  assert.strictEqual(t.elements.text.type, "password");
});

it("Inputs.text() test type=date settings ", () => {
  const t = Inputs.text({type: "date", label: "Date",  value: "1970-01-01"});
  assert.strictEqual(t.value, "1970-01-01");
  assert.strictEqual(t.textContent.trim(), "Date");
  assert.strictEqual(t.elements.text.type, "date");
});

it("Inputs.text() test type=date setting initial value ", () => {
  const t = Inputs.text({type: "date", label: "Date",  value: "1970-01-01", min: "1970-01-01", max: "2021-07-11"});
  assert.strictEqual(t.value, "1970-01-01");
  assert.strictEqual(t.textContent.trim(), "Date");
  assert.strictEqual(t.elements.text.type, "date");
  assert.strictEqual(t.elements.text.min, "1970-01-01");
  assert.strictEqual(t.elements.text.max, "2021-07-11");
});

it("Inputs.text() test type=date settings for min and max", () => {
  const t = Inputs.text({type: "date", label: "Date",  value: "2010-01-01", min: "2000-01-01", max: "2021-07-11"});
  assert.strictEqual(t.value, "2010-01-01");
  t.value = "2015-01-01";
  assert.strictEqual(t.value, "2015-01-01");
  t.value = "1999-01-01";
  // We should not be able to the date to a value outside of the [min, max] range
  assert.notStrictEqual(t.value, "1999-01-01");
  // verify that trying to set an invalid date does not change the existing value
  assert.strictEqual(t.value, "2015-01-01");
});
