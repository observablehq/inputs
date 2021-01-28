module.exports = {
  alias: {
    "@observablehq/inputs": "./src/index.js"
  },
  devOptions: {
    port: 8008
  },
  mount: {
    "src": "/src",
    "test/data": "/data",
    "scratch": "/"
  }
};
