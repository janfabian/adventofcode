const fs = require("fs");
const path = require("path");

module.exports.input = (pwd, filename) => {
  return fs.readFileSync(path.resolve(pwd, filename), {
    encoding: "utf8",
  });
};

module.exports.debug = (v) => {
  if (process.env.DEBUG) {
    console.log(v);
  }
};
