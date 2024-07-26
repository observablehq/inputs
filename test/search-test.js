import assert from "node:assert";
import * as Inputs from "../src/index.js";
import it from "./jsdom.js";

it("Inputs.search(data) handles word boundaries", () => {
  const s = Inputs.search(["red", "blue", "The Real", "Mr.Real", "un-real"], {query: "re"});
  assert.deepStrictEqual(s.value, ["red", "The Real", "Mr.Real"]);
});

it("Inputs.search(data) supports Cyrillic symbols", () => {
  const s = Inputs.search(["red", "дом", "чудо", "Река Дон"], {query: "до"});
  assert.deepStrictEqual(s.value, ["дом", "Река Дон"]);
});
