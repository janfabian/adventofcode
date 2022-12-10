function parseInput(input) {
  return input.split("\n").map((l) => l.split(" "));
}

const OPS = {
  ADDX: "addx",
  NOOP: "noop",
};

function parseOp([op, v]) {
  switch (op) {
    case OPS.ADDX: {
      return [2, parseInt(v)];
    }
    case OPS.NOOP: {
      return [1, 0];
    }
    default: {
      throw new Error("unparsable op");
    }
  }
}

module.exports.part1 = (input) => {
  const ops = parseInput(input);

  const states = [[0, 1]];

  for (const op of ops) {
    const lastState = states[states.length - 1];
    const opChangeState = parseOp(op);

    states.push([
      lastState[0] + opChangeState[0],
      lastState[1] + opChangeState[1],
    ]);
  }

  return [20, 60, 100, 140, 180, 220]
    .map((c) => {
      const ix = states.findIndex(([_c]) => c <= _c);

      return [c, states[ix - 1][1]];
    })
    .reduce((acc, [c, n]) => BigInt(c) * BigInt(n) + acc, 0n);
};

const ROW_LENGTH = 40;

function print(array) {
  return array.map((l) => l.join("")).join("\n");
}

module.exports.part2 = (input) => {
  const ops = parseInput(input);

  const states = [[0, 1]];

  for (const op of ops) {
    const lastState = states[states.length - 1];
    const opChangeState = parseOp(op);

    states.push([
      lastState[0] + opChangeState[0],
      lastState[1] + opChangeState[1],
    ]);
  }

  const screen = new Array(6).fill().map(() => []);

  let currentState = [-1, 0];

  for (let ix = 0; ix < 240; ix++) {
    const column = ix % ROW_LENGTH;
    const row = Math.floor(ix / ROW_LENGTH);

    let [c] = states[0];
    if (ix >= c) {
      currentState = states.shift();
    }
    let [, point] = currentState;

    screen[row][column] = Math.abs(point - column) < 2 ? "#" : ":";
  }

  return print(screen);
};
