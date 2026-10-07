import assert from "node:assert";
import {TimeUnit, dateDay, tableFromArrays, timestamp} from "@uwdata/flechette";
import {table} from "../src/index.js";
import it from "./jsdom.js";

it("Inputs.table() detects day and microsecond dates in Flechette tables with useDate", async () => {
  const t = table(tableFromArrays({
    day: [new Date("2024-01-02")],
    us: [new Date("2024-01-03T12:34Z")]
  }, {
    types: {day: dateDay(), us: timestamp(TimeUnit.MICROSECOND)},
    useDate: true
  }));
  assert.strictEqual(t.querySelector("td:nth-of-type(2)").innerHTML, "2024-01-02");
  assert.strictEqual(t.querySelector("td:nth-of-type(3)").innerHTML, "2024-01-03T12:34Z");
});

it("Inputs.table() formats pre-1970 dates in Flechette tables with useDate", async () => {
  const t = table(tableFromArrays({
    day: [new Date("1969-07-20")],
    us: [new Date("1969-07-20T20:17Z")]
  }, {
    types: {day: dateDay(), us: timestamp(TimeUnit.MICROSECOND)},
    useDate: true
  }));
  assert.strictEqual(t.querySelector("td:nth-of-type(2)").innerHTML, "1969-07-20");
  assert.strictEqual(t.querySelector("td:nth-of-type(3)").innerHTML, "1969-07-20T20:17Z");
});

it("Inputs.table() formats BigInt timestamps in Flechette tables with useBigIntTimestamp", async () => {
  const date = [new Date("2024-01-03T12:34:56.789Z")];
  const t = table(tableFromArrays({s: [new Date("2024-01-03T12:34:56Z")], ms: date, us: date, ns: date}, {
    types: {s: timestamp(TimeUnit.SECOND), ms: timestamp(TimeUnit.MILLISECOND), us: timestamp(TimeUnit.MICROSECOND), ns: timestamp(TimeUnit.NANOSECOND)},
    useBigIntTimestamp: true
  }));
  assert.strictEqual(t.querySelector("td:nth-of-type(2)").innerHTML, "2024-01-03T12:34:56Z");
  assert.strictEqual(t.querySelector("td:nth-of-type(3)").innerHTML, "2024-01-03T12:34:56.789Z");
  assert.strictEqual(t.querySelector("td:nth-of-type(4)").innerHTML, "2024-01-03T12:34:56.789Z");
  assert.strictEqual(t.querySelector("td:nth-of-type(5)").innerHTML, "2024-01-03T12:34:56.789Z");
});

it("Inputs.table() formats day dates with a time part in Flechette tables with useDate", async () => {
  const t = table(tableFromArrays({
    day: [new Date("2024-01-02T20:17Z"), new Date("1969-07-20T20:17Z")]
  }, {
    types: {day: dateDay()},
    useDate: true
  }));
  const [d1, d2] = t.querySelectorAll("td:nth-of-type(2)");
  assert.strictEqual(d1.innerHTML, "2024-01-02");
  assert.strictEqual(d2.innerHTML, "1969-07-20");
});
