function parseColumns(input) {
  const lines = input.split("\n\n")[0].split("\n").slice(0, -1);

  const linesParsed = lines.map((line) => {
    let ix = 1;
    const lineParsed = [];
    while (ix <= line.length) {
      lineParsed.push(line[ix] === " " ? null : line[ix]);
      ix += 4;
    }

    return lineParsed;
  });

  return linesParsed
    .reverse()
    .reduce(
      (res, l, x) => {
        l.forEach((i, y) => {
          res[y][x] = i;
        });

        return res;
      },
      new Array(linesParsed[0].length).fill().map(() => [])
    )
    .map((column) => {
      let top = false;

      return column
        .reverse()
        .filter((b) => {
          const isNull = b === null;
          top = top || !isNull;

          return top;
        })
        .reverse();
    });
}

function parseInstruction(input) {
  return input
    .split("\n\n")[1]
    .split("\n")
    .map((l) => l.split(" "))
    .map(([, l, , from, , to]) => [l, from, to].map((n) => parseInt(n)));
}

function parseOutput(c) {
  return c
    .map((c) => c[c.length - 1])
    .filter(Boolean)
    .join("");
}

module.exports.part1 = (input) => {
  const c = parseColumns(input);
  const i = parseInstruction(input);

  i.forEach(([l, from, to]) => {
    c[to - 1] = c[to - 1].concat(c[from - 1].splice(-l).reverse());
  });

  return parseOutput(c);
};

module.exports.part2 = (input) => {
  const c = parseColumns(input);
  const i = parseInstruction(input);

  i.forEach(([l, from, to]) => {
    c[to - 1] = c[to - 1].concat(c[from - 1].splice(-l));
  });

  return parseOutput(c);
};
