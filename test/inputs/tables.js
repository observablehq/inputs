import * as Inputs from "@observablehq/inputs";
import * as d3 from "d3";

export async function table() {
  const athletes = await d3.csv("data/athletes.csv");
  return Inputs.table(athletes);
}

export function tableUndefined() {
  return Inputs.table([undefined, {a: 1}]);
}

export function tableSparse() {
  const sparse = new Array(10);
  sparse[8] = {a: 1};
  return Inputs.table(sparse);
}
