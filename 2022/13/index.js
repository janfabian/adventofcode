function parsePacket(p) {
  const stack = [];

  let ns = "";

  function parseStringStack() {
    if (ns.length === 0) {
      return;
    }
    const openList = stack[stack.length - 1];
    openList.push(parseInt(ns));
    ns = "";
  }

  for (const [ix, l] of [...p].entries()) {
    switch (l) {
      case "[": {
        stack.push([]);
        break;
      }
      case "]": {
        parseStringStack();
        const l = stack.pop();
        const openList = stack[stack.length - 1];
        if (!openList) {
          if (ix !== p.length - 1) {
            throw new Error("Error parsing input");
          }

          return l;
        }
        openList.push(l);
        break;
      }
      case ",": {
        parseStringStack();
        break;
      }
      default: {
        ns += l;
      }
    }
  }

  throw new Error("Error parsing input");
}

function parsePair(p) {
  return p.split("\n").map(parsePacket);
}

function parsePairs(input) {
  return input.split("\n\n").map(parsePair);
}

function isRightOrder(pl, pr) {
  let result = pr.length - pl.length;

  for (const [ix, leftItem] of pl.entries()) {
    const rightItem = pr[ix];

    if (rightItem === undefined) {
      break;
    }

    if (Number.isInteger(leftItem) && Number.isInteger(rightItem)) {
      if (leftItem === rightItem) {
        continue;
      }

      return rightItem - leftItem;
    } else {
      result = isRightOrder([leftItem].flat(), [rightItem].flat());
    }

    if (result !== 0) {
      return result;
    }
  }

  return pr.length - pl.length;
}

module.exports.part1 = (input) => {
  const pairs = parsePairs(input);

  return pairs
    .map((p, ix) => [isRightOrder(p[0], p[1]), ix])
    .filter(([o]) => o > -1)
    .map(([, ix]) => ix + 1)
    .reduce((acc, n) => acc + n, 0);
};

module.exports.part2 = (input) => {
  const pairs = parsePairs(input)
    .flat()
    .concat([[[2]], [[6]]])
    .sort((p1, p2) => -isRightOrder(p1, p2));

  const i1 = pairs.findIndex((p) => JSON.stringify(p) === "[[2]]") + 1;
  const i2 = pairs.findIndex((p) => JSON.stringify(p) === "[[6]]") + 1;

  return i1 * i2;
};
