const processTile = (tileInput) => {
  const a = tileInput[0];
  const b = tileInput.map((line) => line.slice(-1)).join("");
  const c = [...tileInput.slice(-1)[0]].reverse().join("");
  const d = tileInput
    .map((line) => line.slice(0, 1))
    .reverse()
    .join("");
  const borders = [a, b, c, d];

  return [borders, borders.map((s) => [...s].reverse().join(""))];
};

const headerRegexp = /(\d+):$/;

const first = (input) => {
  const tilesInput = input.trimEnd().split("\n\n");
  const tileNames = [];
  const tileBorders = [];
  const tiles = [];

  tilesInput.forEach((tileInput) => {
    const [header, ...tile] = tileInput.split("\n");
    const n = header.match(headerRegexp)[1];
    tiles.push(tile);
    tileNames.push(n);
    tileBorders.push(processTile(tile));
  });

  const possibles = [];

  const neighbours = [];
  for (let i = 0; i < tileBorders.length; i++) {
    const iteratedBorders = tileBorders[i][0];
    const iteratedNeighbours = [];
    let corners = 0;

    for (let j = 0; j < tileBorders.length; j++) {
      if (i === j) {
        continue;
      }
      let n = 0;
      let m = 0;
      for (const border of iteratedBorders) {
        if (tileBorders[j][0].includes(border)) {
          n++;
        }
        if (tileBorders[j][1].includes(border)) {
          m++;
        }
      }
      if (n === 1 || m === 1) {
        corners++;
      }
      if (n >= 1 || m >= 1) {
        iteratedNeighbours.push(j);
      }
    }
    if (corners === 2) {
      possibles.push(tileNames[i]);
    }
    neighbours.push(iteratedNeighbours);
  }

  return [
    possibles.reduce((p, n) => p * parseInt(n), 1),
    neighbours,
    tiles,
    tileNames,
  ];
};

module.exports.first = first;

const adjustCorner = (corner, next, bottom) => {
  const calc = (corner, next, isBottom = false) => {
    const [i, , flipped] = findAdjacent(processTile(corner), processTile(next));
    let rotations = (5 - i) % 4;
    // 0 1
    // 1 0
    // 2 3
    // 3 2
    if (isBottom) {
      rotations = (6 - i) % 4;
      // 0 2
      // 1 1
      // 2 0
      // 3 3
    }
    let result = corner;
    for (let i = 0; i < rotations; i++) {
      result = rotate90d(result);
    }

    if (flipped) {
      if (isBottom) {
        result = flipX(result);
      } else {
        result = flipY(result);
      }
    }

    return result;
  };
  let result = calc(corner, next);
  const bottomBorder = processTile(result)[0][2];

  const bottomBorders = processTile(bottom);

  if (
    bottomBorders[0].includes(bottomBorder) ||
    bottomBorders[1].includes(bottomBorder)
  ) {
    return result;
  }

  result = calc(corner, bottom, true);

  return result;
};

const adjustNext = (commonBorder, next, isBottom) => {
  const [i, flipped] = findBorderAdjacent(commonBorder, processTile(next));
  let rotations;
  if (isBottom) {
    rotations = (4 - i) % 4;
    // 0 -> 0
    // 1 -> 3
    // 2 -> 2
    // 3 -> 1
  } else {
    rotations = 3 - i;
    // 3 -> 0
    // 0 -> 3
    // 1 -> 2
    // 2 -> 1
  }
  let result = next;
  for (let i = 0; i < rotations; i++) {
    result = rotate90d(result);
  }
  if (flipped) {
    if (isBottom) {
      result = flipX(result);
    } else {
      result = flipY(result);
    }
  }

  return result;
};

const constructFirstRow = (neighbours) => {
  const cornerIx = neighbours.findIndex((n) => n.length === 2);
  const result = [];
  const toProcess = [cornerIx];
  while (toProcess.length > 0) {
    const tileIx = toProcess.splice(0, 1)[0];
    result.push(tileIx);
    const ns = neighbours[tileIx];

    const border = ns.find(
      (n) => neighbours[n].length === 3 && !result.includes(n)
    );
    const corner = ns.find(
      (n) => neighbours[n].length === 2 && !result.includes(n)
    );
    if (border != null) {
      toProcess.push(border);
    } else if (corner != null) {
      result.push(corner);
    } else {
      throw new Error("unparsable");
    }
  }

  return result;
};

const constructNextRow = (row, im, neighbours) => {
  const newRow = [];
  for (const item of row) {
    const m = neighbours[item].find(
      (i) => !newRow.includes("" + i) && !im.includes("" + i)
    );

    if (m == null) {
      throw new Error("unparsable");
    }

    newRow.push(m);
  }

  return newRow;
};

const findBorderAdjacent = (border, t) => {
  let i;
  let flipped = false;
  if (t[0].includes(border)) {
    i = t[0].findIndex((i) => i === border);
  } else if (t[1].includes(border)) {
    i = t[1].findIndex((i) => i === border);
    flipped = true;
  }
  return [i, flipped];
};

const findAdjacent = (t1, t2) => {
  let i = 0;
  let j;
  let flipped = false;
  for (let border of t1[0]) {
    if (t2[0].includes(border)) {
      j = [...t2[0]].findIndex((i) => i === border);
      break;
    }
    if (t2[1].includes(border)) {
      j = [...t2[1]].findIndex((i) => i === border);
      flipped = true;
      break;
    }
    i++;
  }

  return [i, j, flipped];
};

const rotate90d = (tile) => {
  let rotatedTile = Array(tile[0].length)
    .fill()
    .map(() => []);
  tile.forEach((y) =>
    [...y].forEach((x, ix) => rotatedTile[ix].splice(0, 0, x))
  );
  rotatedTile = rotatedTile.map((y) => y.join(""));
  return rotatedTile;
};

const flipY = (tile) => {
  return [...tile.map((y) => [...y].join("")).reverse()];
};

const flipX = (tile) => {
  return [...tile.map((y) => [...y].reverse().join(""))];
};

const monsters = (() => {
  const monster = `
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   
`;
  const m = monster.split("\n").slice(1, -1);
  const m1 = rotate90d(rotate90d(m));
  const m2 = rotate90d(m);
  const m3 = rotate90d(rotate90d(rotate90d(m)));
  return [m, flipX(m), m1, flipX(m1), m2, flipX(m2), m3, flipX(m3)];
})();

const sharpSize = (im) => [...im.join("")].filter((s) => s === "#").length;

const getSubset = (im, x, y, width, height) =>
  im.slice(y, y + height).map((l) => l.slice(x, x + width));

const containsMonster = (monster, subset) => {
  let result = 1;
  let i = 0;
  monster.forEach((y, yx) =>
    [...y].forEach((x, xx) => {
      if (x === "#") {
        if (subset[yx][xx] !== "#") {
          i++;
        }
        result &= subset[yx][xx] === "#";
      }
    })
  );

  return Boolean(result);
};

module.exports.second = (input) => {
  const [, neighbours, tiles, tileNames] = first(input);
  const im = [constructFirstRow(neighbours)];
  while (im.length * im[0].length !== tiles.length) {
    const r = im.slice(-1)[0];
    const n = constructNextRow(r, im.join().split(","), neighbours);
    im.push(n);
  }

  let image = im.map((y) => y.map((x) => tiles[x]));

  let prev;
  for (let y = 0; y < image.length; y++) {
    if (y > 0) {
      prev = image[y - 1][0];
    }
    for (let x = 0; x < image[y].length; x++) {
      if (x === 0 && y === 0) {
        prev = adjustCorner(image[0][0], image[0][1], image[1][0]);
      } else {
        let commonBorder;
        if (x === 0) {
          commonBorder = processTile(prev)[1][2];
        } else {
          commonBorder = processTile(prev)[1][1];
        }
        prev = adjustNext(commonBorder, image[y][x], x === 0);
      }
      image[y][x] = prev;
    }
  }

  image = image
    .map((y) =>
      y.reduce((s, x) => {
        x.slice(1, -1).forEach((r, rx) => {
          r = r.slice(1, -1);
          s[rx] = (s[rx] || "") + r;
        });
        return s;
      }, [])
    )
    .reduce((s, a) => [...s, ...a], []);

  let result = sharpSize(image);
  const monsterSize = sharpSize(monsters[0]);
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[y].length; x++) {
      for (const monster of monsters) {
        const width = monster[0].length;
        const height = monster.length;

        const subset = getSubset(image, x, y, width, height);
        if (subset.length !== height || subset[0].length !== width) {
          continue;
        }

        if (containsMonster(monster, subset)) {
          result -= monsterSize;
        }
      }
    }
  }

  return result;
};
