import * as Inputs from "@observablehq/inputs";
import * as d3 from "d3";

export async function table() {
  const athletes = await d3.csv("data/athletes.csv");
  return Inputs.table(athletes);
}
