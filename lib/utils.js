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

module.exports.print_matrix = (matrix, p = 2) => {
  return matrix.reduce(
    (res, row) => (res += row.map((i) => `${i}`.padStart(p)).join("") + "\n"),
    ""
  );
};
