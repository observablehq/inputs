import * as Inputs from "@observablehq/inputs";
import assert from "assert";
import it from "./jsdom.js";

it("Inputs.search(data) handles word boundaries", () => {
  const s = Inputs.search(["red", "blue", "The Real", "Mr.Real", "un-real"], {query: "re"});
  assert.deepStrictEqual(s.value, ["red", "The Real", "Mr.Real"]);
});

it("Inputs.search(data) supports Cyrillic symbols", () => {
  const s = Inputs.search(["red", "дом", "чудо", "Река Дон"], {query: "до"});
  assert.deepStrictEqual(s.value, ["дом", "Река Дон"]);
});

it("Inputs.search(data) supports full search", () => {
  const s = Inputs.search(["red", "blue", "The Real", "Mr.Real", "un-real"], {query: "re", full:true});
  assert.deepStrictEqual(s.value, ["red", "The Real", "Mr.Real", "un-real"]);

  const s2 = Inputs.search(["red", "дом", "чудо", "Река Дон"], {query: "до", full:true});
  assert.deepStrictEqual(s2.value, ["дом", "чудо", "Река Дон"]);
});