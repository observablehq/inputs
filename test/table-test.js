import assert from "node:assert";
import * as Inputs from "../src/index.js";
import it from "./jsdom.js";

const data = [{x: 1}, {x: 2}, {x: 3}, {x: 4}, {x: 5}];
const checked = table => Array.from(table.querySelectorAll('tbody input'), input => input.checked);
const header = table => table.querySelector('thead input');

it("Inputs.table value setter synchronizes single-selection rows and header", () => {
  const table = Inputs.table(data, {multiple: false});
  let events = 0;
  table.addEventListener("input", () => ++events);
  assert.strictEqual(table.value, null);
  assert.strictEqual(header(table).disabled, true);
  table.value = data[1];
  assert.strictEqual(table.value, data[1]);
  assert.deepStrictEqual(checked(table), [false, true, false, false, false]);
  assert.strictEqual(header(table).checked, true);
  assert.strictEqual(header(table).disabled, false);
  table.value = data[2];
  assert.strictEqual(table.value, data[2]);
  assert.deepStrictEqual(checked(table), [false, false, true, false, false]);
  table.value = null;
  assert.strictEqual(table.value, null);
  assert.deepStrictEqual(checked(table), [false, false, false, false, false]);
  assert.strictEqual(header(table).checked, false);
  assert.strictEqual(header(table).disabled, true);
  table.value = data[0];
  table.value = {x: 1}; // only rows from the input data can be selected
  assert.strictEqual(table.value, null);
  assert.deepStrictEqual(checked(table), [false, false, false, false, false]);
  assert.strictEqual(events, 0); // programmatic assignment does not emit input
});

it("Inputs.table value setter uses the displayed row order", () => {
  const table = Inputs.table(data, {multiple: false, reverse: true});
  table.value = data[1];
  assert.strictEqual(table.value, data[1]);
  assert.deepStrictEqual(checked(table), [false, false, false, true, false]);
  table.value = data[4];
  assert.deepStrictEqual(checked(table), [true, false, false, false, false]);
});

it("Inputs.table value setter preserves selection when rows are appended", () => {
  const table = Inputs.table(data, {multiple: false, rows: 1});
  assert.strictEqual(checked(table).length, 2);
  table.value = data[4];
  assert.strictEqual(table.value, data[4]);
  assert.deepStrictEqual(checked(table), [false, false]);
  table.dispatchEvent(new Event("scroll"));
  table.dispatchEvent(new Event("scroll"));
  table.dispatchEvent(new Event("scroll"));
  assert.deepStrictEqual(checked(table), [false, false, false, false, true]);
  table.value = data[0];
  assert.deepStrictEqual(checked(table), [true, false, false, false, false]);
});

it("Inputs.table supports interaction after programmatic single selection", () => {
  const table = Inputs.table(data, {multiple: false});
  table.value = data[1];
  header(table).click();
  assert.strictEqual(table.value, null);
  assert.deepStrictEqual(checked(table), [false, false, false, false, false]);
  table.querySelectorAll('tbody input')[3].click();
  assert.strictEqual(table.value, data[3]);
  assert.deepStrictEqual(checked(table), [false, false, false, true, false]);
});

it("Inputs.table value setter still supports nonselectable tables", () => {
  const table = Inputs.table(data, {multiple: false, select: false});
  table.value = data[1];
  assert.strictEqual(table.value, data[1]);
  table.value = null;
  assert.strictEqual(table.value, null);
  assert.strictEqual(table.querySelector('input'), null);
});

it("Inputs.table value setter retains multiple-selection behavior", () => {
  const table = Inputs.table(data);
  table.value = [data[0], data[2]];
  assert.deepStrictEqual(Array.from(table.value), [data[0], data[2]]);
  assert.deepStrictEqual(checked(table), [true, false, true, false, false]);
});
