import {disposal} from "./disposal.js";
import {bubbles} from "./event.js";

export function bind(target, source, invalidation = disposal(target)) {
  const sourceEvent = eventof(source);
  const onsource = () => set(target, source);
  const ontarget = () => (set(source, target), source.dispatchEvent(new Event(sourceEvent, bubbles)));
  onsource();
  target.addEventListener(eventof(target), ontarget);
  source.addEventListener(sourceEvent, onsource);
  invalidation.then(() => source.removeEventListener(sourceEvent, onsource));
  return target;
}

function get(input) {
  switch (input.type) {
    case "range":
    case "number": return input.valueAsNumber;
    case "date": return input.valueAsDate;
    case "checkbox": return input.checked;
    case "file": return input.multiple ? input.files : input.files[0];
    default: return input.value;
  }
}

function set(target, source) {
  const value = get(source);
  switch (target.type) {
    case "range":
    case "number": target.valueAsNumber = value; break;
    case "date": target.valueAsDate = value; break;
    case "checkbox": target.checked = value; break;
    case "file": target.multiple ? (target.files = value) : (target.files = [value]); break;
    default: target.value = value; break;
  }
}

function eventof(input) {
  switch (input.type) {
    case "button":
    case "submit": return "click";
    case "file": return "change";
    default: return "input";
  }
}
