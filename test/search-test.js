import * as Inputs from "@observablehq/inputs";
import assert from "assert";
import it from "./jsdom.js";

it("Inputs.search(data) handles word boundaries", () => {
  const s = Inputs.search(["red", "green", "blue", "The Real"], {query: "re"});
  assert.deepStrictEqual(s.value, ["red", "The Real"]);
});

it("Inputs.search(data) supports Cyrillic symbols", () => {
  const s = Inputs.search(["red", "дом", "чудо", "Река Дон"], {query: "до"});
  assert.deepStrictEqual(s.value, ["дом", "Река Дон"]);
});