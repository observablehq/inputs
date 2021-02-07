import {promises as fs} from "fs";
import * as path from "path";
import {JSDOM} from "jsdom";
import tape from "tape-await";

export default Object.assign(wrap(tape), {
  skip: wrap(tape.skip),
  only: wrap(tape.only)
});

function wrap(tape) {
  return function(description, run) {
    return tape(description, test => {
      return withJsdom(() => run(test));
    });
  };
}

export async function withJsdom(run) {
  const jsdom = new JSDOM("");
  global.window = jsdom.window;
  global.document = jsdom.window.document;
  global.Event = jsdom.window.Event;
  global.Node = jsdom.window.Node;
  global.NodeList = jsdom.window.NodeList;
  global.HTMLCollection = jsdom.window.HTMLCollection;
  global.fetch = async (href) => new Response(path.resolve("./test", href));
  try {
    return await run();
  } finally {
    delete global.window;
    delete global.document;
    delete global.Event;
    delete global.Node;
    delete global.NodeList;
    delete global.HTMLCollection;
    delete global.fetch;
  }
}

class Response {
  constructor(href) {
    this._href = href;
    this.ok = true;
    this.status = 200;
  }
  async text() {
    return fs.readFile(this._href, {encoding: "utf-8"});
  }
  async json() {
    return JSON.parse(await this.text());
  }
}
