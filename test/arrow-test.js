import assert from "node:assert";
import {tableFromJSON} from "apache-arrow";
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
