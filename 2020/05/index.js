const { debug } = require("../../lib/utils");
module.exports = (input) => {
  const plane = new Array((input.match(/\n/g) || []).length);
  const result = input.split("\n").reduce((max, line) => {
    if (line.length !== 10) {
      return max;
    }
    const result = parseInt(line.replace(/F|L/g, "0").replace(/B|R/g, "1"), 2);
    plane[result] = true;
    debug({ line, result });

    return Math.max(max, result);
  }, -1);

  let passFirstEmpty = false;

  const freeSeatIx =
    plane.findIndex((_a, seatIx) => {
      if (passFirstEmpty) {
        return plane[seatIx] && !plane[seatIx - 1];
      } else {
        passFirstEmpty = plane[seatIx];
      }
    }, 0) - 1;

  return { result, freeSeatIx };
};
