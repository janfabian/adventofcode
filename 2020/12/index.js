const dirs = ["E", "S", "W", "N"];
const dirVectors = {
  N: [0, 1],
  S: [0, -1],
  E: [1, 0],
  W: [-1, 0],
};

const parse = (line) => {
  const cmd = line[0];
  const n = parseInt(line.slice(1));
  return [cmd, n];
};

const multiply = (n, a1) => a1.map((an) => an * n);
const add = (a1, a2) => a1.map((an, i) => an + a2[i]);

const degreesToRadians = (degrees) => degrees * (Math.PI / 180);
const sin = (r) => Math.round(Math.sin(r));
const cos = (r) => Math.round(Math.cos(r));
const rotateVector = (v, r) => [
  cos(r) * v[0] - sin(r) * v[1],
  sin(r) * v[0] + cos(r) * v[1],
];

const process = (input, initWaypoint = [1, 0], moveWaypoint = false) => {
  const map = input
    .trimEnd()
    .split("\n")
    .map(parse)
    .reduce(
      ([result, waypoint], [cmd, n]) => {
        if (dirs.includes(cmd)) {
          if (moveWaypoint) {
            waypoint = add(waypoint, multiply(n, dirVectors[cmd]));
          } else {
            result = add(result, multiply(n, dirVectors[cmd]));
          }
        } else if (cmd === "F") {
          result = add(result, multiply(n, waypoint));
        } else if (cmd === "R") {
          waypoint = rotateVector(waypoint, -degreesToRadians(n));
        } else if (cmd === "L") {
          waypoint = rotateVector(waypoint, degreesToRadians(n));
        }
        return [result, waypoint];
      },
      [[0, 0], initWaypoint]
    );
  return map[0].reduce((s, i) => s + Math.abs(i), 0);
};

module.exports.first = (input) => process(input);

module.exports.second = (input) => process(input, [10, 1], true);
