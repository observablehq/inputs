import * as Inputs from "@observablehq/inputs";
import * as d3 from "d3";
import {html} from "htl";

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

export function tableVariousDates() {
  return Inputs.table([{A: "Hello, not a date"}, {A: new Date(Date.UTC(2000, 0, 1))}]);
}

export function tableCustomHeader() {
  return Inputs.table([{foo: "hello"}], {header: {foo: "Foo"}});
}

export function tableCustomHeaderHtml() {
  return Inputs.table([{foo: "hello"}], {header: {foo: html`<i>Foo</i>`}});
}

export function tableVariousObjects() {
  return Inputs.table([
    {A: null},
    {A: undefined}, // explicit undefined
    {},
    {A: ["a", "b"]},
    {A: Float32Array.from([1, 2, 3])},
    {A: Array.from({length: 30}, (_, i)=> i)},
    {A: Array.from({length: 31}, (_, i)=> i)},
    {A: [[1, 2], ["a"]]},
    {A: {key: "value"}},
    {A: {key: {key: "value"}}}
  ]);
}

export function tableCircular() {
  const o = {};
  o.circular = o;
  return Inputs.table([
    {A: o}
  ]);
}

export function tableHtml() {
  return Inputs.table([
    {A: html`<span style="font-variant: small-caps">hello`}
  ]);
}
