const processTile = (tileInput) => {
  const a = tileInput[0];
  const b = tileInput.map((line) => line.slice(-1)).join("");
  const c = tileInput.slice(-1)[0];
  const d = tileInput.map((line) => line.slice(0, 1)).join("");
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
    // 5 - i % 4
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
    console.log(rotations);
    console.log(flipped);
    let result = corner;
    if (flipped) {
      if (i % 2 === 0) {
        result = flipX(result);
      } else {
        result = flipY(result);
      }
    }

    for (let i = 0; i < rotations; i++) {
      result = rotate90d(result);
    }

    return result;
  };
  let result = calc(corner, next);
  try {
    adjustNext(bottom, corner);
  } catch (e) {
    result = calc(corner, bottom, true);
    adjustNext(next, corner);
  }

  return result;
};

const adjustNext = (current, next) => {
  const [i, j, flipped] = findAdjacent(processTile(current), processTile(next));

  // 0 1 -> 3
  // 1 1 -> 2
  // 2 1 -> 1
  // 3 1 -> 0

  // 0 2 -> 0
  // 1 2 -> 3
  // 2 2 -> 2
  // 3 2 -> 1
  let rotations;
  if (j === 1) {
    rotations = 3 - i;
  } else if (j === 2) {
    rotations = (4 - i) % 4;
  } else {
    throw new Error("unparsable");
  }
  // let rotations = Math.abs(j - i);
  let result = current;
  if (flipped) {
    if (i % 2 === 0) {
      result = flipX(result);
    } else {
      result = flipY(result);
    }
  }

  for (let i = 0; i < rotations; i++) {
    result = rotate90d(result);
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

const findAdjacent = (t1, t2) => {
  let i = 0;
  let j;
  let flipped = false;
  for (const border of t1[0]) {
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
  return [...tile.reverse()];
};

const flipX = (tile) => {
  return [...tile.map((y) => [...y].reverse().join(""))];
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
    for (let x = 0; x < image[y].length; x++) {
      if (x === 0 && y === 0) {
        prev = adjustCorner(image[0][0], image[0][1], image[1][0]);
        console.log(image[0][0]);
        console.log("===");
        console.log(prev);
      } else {
        prev = adjustNext(prev, image[y][x]);
      }
      image[y][x] = prev;
    }
  }

  console.log(image);

  // image = image.map((y, yx) =>
  //   y.reduce((s, x, xx) => {
  //     x.forEach((r, rx) => {
  //       if (yx !== image.length - 1) {
  //         if (rx === x.length - 1) {
  //           return;
  //         }
  //       }
  //       if (xx !== y.length - 1) {
  //         r = r.slice(0, -1);
  //       }
  //       s[rx] = (s[rx] || "") + r;
  //     });
  //     return s;
  //   }, [])
  // );

  // console.log(image);
  const bla = adjustCorner(tiles[im[0][0]], tiles[im[0][1]]);

  // console.log(bla.join("\n"));
  // console.log("====");
  // console.log(adjustNext(tiles[im[0][1]], bla).join("\n"));
  // console.log(tiles[im[0][1]].join("\n"));
  // console.log("====");
  // console.log(tiles[im[1][0]].join("\n"));
  // console.log("====");
  // console.log(rotate90d(tiles[0]).join("\n"));
  // console.log("====");
  // console.log(flipX(tiles[0]).join("\n"));
  // console.log("====");
  // console.log(flipY(tiles[0]).join("\n"));
  // console.log(image);
};
