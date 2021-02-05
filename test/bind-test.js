import {bind} from "@observablehq/inputs";
import tape from "./jsdom.js";

tape("bind(button, button) dispatches click events", test => {
  const b1 = document.createElement("button");
  const b2 = bind(document.createElement("button"), b1, new Promise(() => {}));
  let clicked = false;
  b1.addEventListener("click", () => void (clicked = true), {once: true});
  b2.dispatchEvent(new CustomEvent("click"));
  test.equal(clicked, true);
});
