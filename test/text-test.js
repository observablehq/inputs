import * as Inputs from "@observablehq/inputs";
import assert from "assert";
import it from "./jsdom.js";

it("Inputs.text() sets the initial value is the empty string", () => {
  const input = Inputs.text();
  assert.strictEqual(input.value, "");
});

it("Inputs.text() sets the initial value, label, placeholder, and type", () => {
  const input = Inputs.text({type: "password", label: "Name", placeholder: "Enter your name", value: "Anonymous"});
  assert.strictEqual(input.value, "Anonymous");
  assert.strictEqual(input.textContent.trim(), "Name");
  assert.strictEqual(input.elements.text.placeholder, "Enter your name");
  assert.strictEqual(input.elements.text.type, "password");
});

it("Inputs.text() supports type=date", () => {
  const input = Inputs.text({type: "date"});
  assert.strictEqual(input.value, "");
  assert.strictEqual(input.elements.text.type, "date");
});

it("Inputs.text() supports type=date with initial value", () => {
  const input = Inputs.text({type: "date", value: "1970-01-01"});
  assert.strictEqual(input.value, "1970-01-01");
  assert.strictEqual(input.elements.text.type, "date");
});

it("Inputs.text() supports type=date with min and max", () => {
  const input = Inputs.text({type: "date", value: "2010-01-01", min: "2000-01-01", max: "2021-07-11"});
  assert.strictEqual(input.elements.text.min, "2000-01-01");
  assert.strictEqual(input.elements.text.max, "2021-07-11");
  assert.strictEqual(input.value, "2010-01-01");
  input.value = "2015-01-01";
  assert.strictEqual(input.value, "2015-01-01");
  input.value = "1999-01-01";
  // We should not be able to set the date to a value outside of the [min, max] range
  assert.notStrictEqual(input.value, "1999-01-01");
  // verify that trying to set an invalid date does not change the existing value
  assert.strictEqual(input.value, "2015-01-01");
});
