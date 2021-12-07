const { debug } = require("../../lib/utils");

module.exports.part1 = (input) => {
  const rows = input.split("\n");
  const l = rows[0].length;

  const n = rows.reduce((bits, row) => {
    for (let ix = 0; ix < l; ix++) {
      bits[ix] += parseInt(row[ix], 2);
    }

    return bits;
  }, Array(l).fill(0));

  const gamma = parseInt(n.map((v) => +(v > rows.length / 2)).join(""), 2);
  const epsilon = ~gamma & ~(~0 << l);

  return gamma * epsilon;
};

module.exports.part2 = (input) => {
  const rows = input.split("\n");
  const l = rows[0].length;

  let oxygen = rows;
  let co2scrubber = rows;

  for (let ix = 0; ix < l; ix++) {
    const bit_count = oxygen.reduce((bit, row) => {
      return bit + parseInt(row[ix], 2);
    }, 0);

    oxygen = oxygen.filter((r) => r[ix] == +(bit_count >= oxygen.length / 2));

    if (oxygen.length === 1) {
      break;
    }
  }

  for (let ix = 0; ix < l; ix++) {
    const bit_count = co2scrubber.reduce((bit, row) => {
      return bit + parseInt(row[ix], 2);
    }, 0);

    co2scrubber = co2scrubber.filter(
      (r) => r[ix] != +(bit_count >= co2scrubber.length / 2)
    );

    if (co2scrubber.length === 1) {
      break;
    }
  }

  return parseInt(oxygen[0], 2) * parseInt(co2scrubber[0], 2);
};
