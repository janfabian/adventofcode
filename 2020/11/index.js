const OCCUPIED = "#";
const FREE = "L";
const FLOOR = ".";

const evalSeat = (map, i, idir, j, jdir) =>
  Number((map[i + idir] || [])[j + jdir] === OCCUPIED);

const recalculate = (map, customEvalSeat) =>
  map.map((line, i) =>
    line.map((place, j) =>
      [
        [0, -1],
        [0, 1],
        [-1, 0],
        [-1, -1],
        [-1, 1],
        [1, 0],
        [1, -1],
        [1, 1],
      ]
        .map(([idir, jdir]) => customEvalSeat(map, i, idir, j, jdir))
        .reduce((sumocc, occ) => sumocc + occ, 0)
    )
  );

const refill = (map, calc, occupiedLimit) =>
  calc.map((line, i) =>
    line.map((occupied, j) => {
      let place = map[i][j];
      if (place === FREE && occupied === 0) {
        return OCCUPIED;
      }
      if (place === OCCUPIED && occupied >= occupiedLimit) {
        return FREE;
      }

      return place;
    })
  );

const hash = (map) => map.map((l) => l.join("")).join("");

const process = (input, opts = { occupiedLimit: 4, evalSeat }) => {
  let map = input
    .trimEnd()
    .split("\n")
    .map((line) => line.split(""));

  let prevHash;
  let currentHash = hash(map);
  let currentMap = map;

  while (prevHash != currentHash) {
    prevHash = currentHash;
    currentMap = refill(
      currentMap,
      recalculate(currentMap, opts.evalSeat),
      opts.occupiedLimit
    );
    currentHash = hash(currentMap);
  }

  return currentMap.reduce(
    (sum, line) => sum + line.filter((p) => p === OCCUPIED).length,
    0
  );
};

module.exports.first = process;

module.exports.second = (input) =>
  process(input, {
    occupiedLimit: 5,
    evalSeat: (map, i, idir, j, jdir) => {
      let place;
      do {
        i = i + idir;
        j = j + jdir;
        place = (map[i] || [])[j];
      } while (place === FLOOR);
      return Number(place === OCCUPIED);
    },
  });
