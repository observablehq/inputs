import assert from "node:assert";
import {DateDay, Table, TimestampMicrosecond, tableFromJSON, vectorFromArray} from "apache-arrow";
import {autoType, csv} from "d3";
import {table} from "../src/index.js";
import it from "./jsdom.js";

it("Inputs.table() detects dates in Arrow tables", async () => {
  const athletes = tableFromJSON(await csv("data/athletes.csv", autoType));
  const t = table(athletes);
  const id = t.querySelector("td:nth-of-type(2)").innerHTML;
  assert.strictEqual(id, "736,041,664");
  const name = t.querySelector("td:nth-of-type(3)").innerHTML;
  assert.strictEqual(name, "A Jesus Garcia");
  const date = t.querySelector("td:nth-of-type(6)").innerHTML;
  assert.strictEqual(date, "1969-10-17");
});

it("Inputs.table() detects day and microsecond dates in Arrow tables", async () => {
  const t = table(new Table({
    day: vectorFromArray([new Date("2024-01-02")], new DateDay()),
    us: vectorFromArray([new Date("2024-01-03T12:34Z")], new TimestampMicrosecond())
  }));
  assert.strictEqual(t.querySelector("td:nth-of-type(2)").innerHTML, "2024-01-02");
  assert.strictEqual(t.querySelector("td:nth-of-type(3)").innerHTML, "2024-01-03T12:34Z");
});

it("Inputs.table() formats pre-1970 dates in Arrow tables", async () => {
  const t = table(new Table({
    day: vectorFromArray([new Date("1969-07-20")], new DateDay()),
    us: vectorFromArray([new Date("1969-07-20T20:17Z")], new TimestampMicrosecond())
  }));
  assert.strictEqual(t.querySelector("td:nth-of-type(2)").innerHTML, "1969-07-20");
  assert.strictEqual(t.querySelector("td:nth-of-type(3)").innerHTML, "1969-07-20T20:17Z");
});

it("Inputs.table() formats day dates with a time part in Arrow tables", async () => {
  const t = table(new Table({
    day: vectorFromArray([new Date("2024-01-02T20:17Z"), new Date("1969-07-20T20:17Z")], new DateDay())
  }));
  const [d1, d2] = t.querySelectorAll("td:nth-of-type(2)");
  assert.strictEqual(d1.innerHTML, "2024-01-02");
  assert.strictEqual(d2.innerHTML, "1969-07-20");
});
