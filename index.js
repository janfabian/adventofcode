const path = require("path");
const { input } = require("./lib/utils");

const args = process.argv.slice(2);
const dir = path.resolve(__dirname, args[0]);

const inputData = input(dir, process.env.INPUT ? process.env.INPUT : "input");

let fn = require(path.resolve(dir, "./index.js"));

if (typeof fn !== "function") {
  fn = fn[args[1]];
}
console.log(fn(inputData));
