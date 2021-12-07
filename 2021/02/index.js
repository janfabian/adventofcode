const { debug } = require("../../lib/utils");

const FORWARD = "forward";
const DOWN = "down";
const UP = "up";

module.exports.part1 = (input) => {
  const res = input
    .split("\n")
    .map((row) => row.split(" "))
    .map(([command, value]) => [command, parseInt(value)])
    .reduce(
      ([horizontal, depth], [command, value]) => {
        switch (command) {
          case FORWARD: {
            horizontal += value;
            break;
          }
          case DOWN: {
            depth += value;
            break;
          }
          case UP: {
            depth -= value;
            break;
          }
        }

        return [horizontal, depth];
      },
      [0, 0]
    );

  return res[0] * res[1];
};

module.exports.part2 = (input) => {
  const res = input
    .split("\n")
    .map((row) => row.split(" "))
    .map(([command, value]) => [command, parseInt(value)])
    .reduce(
      ([horizontal, depth, aim], [command, value]) => {
        switch (command) {
          case FORWARD: {
            horizontal += value;
            depth += value * aim;
            break;
          }
          case DOWN: {
            aim += value;
            break;
          }
          case UP: {
            aim -= value;
            break;
          }
        }

        return [horizontal, depth, aim];
      },
      [0, 0, 0]
    );

  return res[0] * res[1];
};
