const fs = require("fs");
const path = require("path");

module.exports.input = (pwd) => {
  return fs.readFileSync(
    process.env.EXAMPLE
      ? path.resolve(pwd, "./example")
      : path.resolve(pwd, "./input"),
    {
      encoding: "utf8",
    }
  );
};

module.exports.debug = (v) => {
  if (process.env.DEBUG) {
    console.log(v);
  }
};
