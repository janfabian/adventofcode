const CHOICES = {
  ROCK: "rock",
  PAPER: "paper",
  SCISSORS: "scissors",
};

const OPPONENT = {
  A: CHOICES.ROCK,
  B: CHOICES.PAPER,
  C: CHOICES.SCISSORS,
};

const MINE = {
  X: CHOICES.ROCK,
  Y: CHOICES.PAPER,
  Z: CHOICES.SCISSORS,
};

const RESULTS = {
  WIN: "win",
  DRAW: "draw",
  LOSS: "loss",
};

const RESULT_POINTS = {
  [RESULTS.WIN]: 6,
  [RESULTS.DRAW]: 3,
  [RESULTS.LOSS]: 0,
};

const CHOICE_POINTS = {
  [CHOICES.ROCK]: 1,
  [CHOICES.PAPER]: 2,
  [CHOICES.SCISSORS]: 3,
};

function compare(a, b) {
  if (a === b) {
    return RESULTS.DRAW;
  }
  if (a === CHOICES.ROCK) {
    if (b === CHOICES.SCISSORS) {
      return RESULTS.WIN;
    }
    if (b === CHOICES.PAPER) {
      return RESULTS.LOSS;
    }
  }
  if (a === CHOICES.PAPER) {
    if (b === CHOICES.SCISSORS) {
      return RESULTS.LOSS;
    }
    if (b === CHOICES.ROCK) {
      return RESULTS.WIN;
    }
  }
  if (a === CHOICES.SCISSORS) {
    if (b === CHOICES.ROCK) {
      return RESULTS.LOSS;
    }
    if (b === CHOICES.PAPER) {
      return RESULTS.WIN;
    }
  }

  throw new Error("unparsable");
}

module.exports.part1 = (input) => {
  return input
    .split("\n")
    .map((round) => round.split(" "))
    .map(([opponent, mine]) => [
      compare(MINE[mine], OPPONENT[opponent]),
      MINE[mine],
    ])
    .map(
      ([result, myChoice]) => RESULT_POINTS[result] + CHOICE_POINTS[myChoice]
    )
    .reduce((acc, a) => acc + a, 0);
};

const MINE_PART2 = {
  X: RESULTS.LOSS,
  Y: RESULTS.DRAW,
  Z: RESULTS.WIN,
};

function findMyChoice(b, result) {
  if (result === RESULTS.DRAW) {
    return b;
  }
  if (result === RESULTS.WIN) {
    if (b === CHOICES.ROCK) {
      return CHOICES.PAPER;
    }
    if (b === CHOICES.SCISSORS) {
      return CHOICES.ROCK;
    }
    if (b === CHOICES.PAPER) {
      return CHOICES.SCISSORS;
    }
  }
  if (result === RESULTS.LOSS) {
    if (b === CHOICES.PAPER) {
      return CHOICES.ROCK;
    }
    if (b === CHOICES.ROCK) {
      return CHOICES.SCISSORS;
    }
    if (b === CHOICES.SCISSORS) {
      return CHOICES.PAPER;
    }
  }
  throw new Error("unparsable");
}

module.exports.part2 = (input) => {
  return input
    .split("\n")
    .map((round) => round.split(" "))
    .map(([opponent, result]) => [
      MINE_PART2[result],
      findMyChoice(OPPONENT[opponent], MINE_PART2[result]),
    ])
    .map(
      ([result, myChoice]) => RESULT_POINTS[result] + CHOICE_POINTS[myChoice]
    )
    .reduce((acc, a) => acc + a, 0);
};
