import assert from "assert";
import * as Inputs from "@observablehq/inputs";
import it from "./jsdom.js";

it("Inputs.bind(button, button) dispatches click events", () => {
  const b1 = document.createElement("button");
  const b2 = Inputs.bind(document.createElement("button"), b1, new Promise(() => {}));
  let clicked = false;
  b1.addEventListener("click", () => void (clicked = true), {once: true});
  b2.dispatchEvent(new Event("click"));
  assert.strictEqual(clicked, true);
});
