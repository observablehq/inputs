import * as Inputs from "../src/index.js";
import assert from "assert";
import it from "./jsdom.js";

it("Inputs.date() sets the initial value to null", () => {
  const input = Inputs.date();
  assert.strictEqual(input.value, null);
  assert.strictEqual(input.elements.date.type, "date");
});

it("Inputs.date() sets the initial value and label", () => {
  const input = Inputs.date({label: "Date", value: new Date("1970-01-01")});
  assert.deepStrictEqual(input.value, new Date("1970-01-01"));
  assert.strictEqual(input.textContent.trim(), "Date");
});

it("Inputs.date() coerces strings to dates", () => {
  const input = Inputs.date({label: "Date", value: "1970-01-01"});
  assert.deepStrictEqual(input.value, new Date("1970-01-01"));
  input.value = "2021-01-01";
  assert.deepStrictEqual(input.value, new Date("2021-01-01"));
});

it("Inputs.date() coerces numbers to dates", () => {
  const input = Inputs.date({label: "Date", value: Date.UTC(1970, 0, 1)});
  assert.deepStrictEqual(input.value, new Date("1970-01-01"));
  input.value = Date.UTC(2021, 0, 1);
  assert.deepStrictEqual(input.value, new Date("2021-01-01"));
});

it("Inputs.date() coerces non-midnights to midnight", () => {
  const input = Inputs.date({label: "Date", value: new Date("2021-01-05T12:34:45Z")});
  assert.deepStrictEqual(input.value, new Date("2021-01-05"));
  input.value = Date.UTC(2021, 0, 1, 12, 34, 45);
  assert.deepStrictEqual(input.value, new Date("2021-01-01"));
});

it("Inputs.date() sets the initial value, min, and max", () => {
  const input = Inputs.date({type: "date", value: "1970-01-01", min: "1970-01-01", max: "2021-07-11"});
  assert.deepStrictEqual(input.value, new Date("1970-01-01"));
  assert.strictEqual(input.elements.date.min, "1970-01-01");
  assert.strictEqual(input.elements.date.max, "2021-07-11");
  input.value = "2015-01-01";
  assert.deepStrictEqual(input.value, new Date("2015-01-01"));
  // We should not be able to set the date to a value outside of the [min, max] range
  input.value = "1969-01-01";
  assert.notDeepStrictEqual(input.value, new Date("1969-01-01"));
  // verify that trying to set an invalid date does not change the existing value
  assert.deepStrictEqual(input.value, new Date("2015-01-01"));
});
