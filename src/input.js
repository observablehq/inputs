import {bind} from "./bind.js";

export class Input extends EventTarget {
  constructor(value) {
    super();
    this.value = value;
  }
  bind(input, invalidation) {
    return bind(input, this, invalidation);
  }
}
