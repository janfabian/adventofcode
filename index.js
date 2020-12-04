const path = require("path");
const { input } = require("./lib/utils");

const args = process.argv.slice(2);
const dir = path.resolve(__dirname, args[0]);

const inputData = input(dir, process.env.INPUT ? process.env.INPUT : "input");

const fn = require(path.resolve(dir, "./index.js"));

console.log(fn(inputData));
