const OCCUPIED = "#";
const FREE = "L";
const FLOOR = ".";

const evalSeat = (map, i, idir, j, jdir) =>
  Number((map[i + idir] || [])[j + jdir] === OCCUPIED);

const recalculate = (map, customEvalSeat = evalSeat) =>
  map.map((line, i) =>
    line.map((place, j) =>
      [
        customEvalSeat(map, i, 0, j, -1),
        customEvalSeat(map, i, 0, j, +1),
        customEvalSeat(map, i, -1, j, 0),
        customEvalSeat(map, i, -1, j, -1),
        customEvalSeat(map, i, -1, j, +1),
        customEvalSeat(map, i, +1, j, 0),
        customEvalSeat(map, i, +1, j, -1),
        customEvalSeat(map, i, +1, j, +1),
      ].reduce((sumocc, occ) => sumocc + occ, 0)
    )
  );

const refill = (map, calc, occupiedLimit = 4) =>
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

const process = (input, opts = {}) => {
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

module.exports.first = (input) => process(input);

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
