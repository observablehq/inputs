import {JSDOM} from "jsdom";
import tape from "tape-await";

export default Object.assign(wrap(tape), {
  skip: wrap(tape.skip),
  only: wrap(tape.only)
});

function wrap(tape) {
  return function(description, run) {
    return tape(description, async test => {
      const jsdom = new JSDOM("");
      global.window = jsdom.window;
      global.document = jsdom.window.document;
      global.Node = jsdom.window.Node;
      try {
        return await run(test);
      } finally {
        delete global.window;
        delete global.document;
        delete global.Node;
      }
    });
  };
}
