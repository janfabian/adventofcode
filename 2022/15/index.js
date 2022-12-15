function parseSensorBeacon(line) {
  const i = line.indexOf(": closest beacon is at ");

  let sensor = line.slice(10, i);
  let beacon = line.slice(i + 23);

  return [sensor, beacon].map((s) =>
    s.split(", ").map((s) => parseInt(s.slice(2)))
  );
}

function dist([x1, y1], [x2, y2]) {
  return [x2 - x1, y2 - y1]
    .map((n) => Math.abs(n))
    .reduce((acc, n) => acc + n, 0);
}

function union([from1, to1], [from2, to2]) {
  if (to1 < from2 || to2 < from1) {
    return [
      [from1, to1],
      [from2, to2],
    ];
  }

  return [[Math.min(from1, from2), Math.max(to1, to2)]];
}

function merge(intervals) {
  for (let ix = 0; ix < intervals.length - 1; ix++) {
    const u = union(...intervals.slice(ix, ix + 2));

    intervals.splice(ix, 2, ...u);

    if (u.length === 1) {
      ix--;
    }
  }
  return intervals;
}

/*
******************

-------|    |-----
--|   |-----------

******************

-------|    |-----
--------------| |-

******************

-------|    |-----
---------| |------

******************

-------|    |-----
-----|         |--

******************

-------|    |-----
---------|    |---

-------|    |-----
-----|    |-------

*/

function exclude([from1, to1], [from2, to2]) {
  if (from2 > to1 || to2 < from1) {
    return [[from1, to1]];
  }
  to1;
  if (from2 > from1 && to2 < to1) {
    return [
      [from1, from2],
      [to2, to1],
    ];
  }

  if (from2 <= from1 && to2 >= to1) {
    return null;
  }

  if (to2 <= to1) {
    return [[to2, to1]];
  } else {
    return [[from1, from2]];
  }
}

module.exports.part1 = (input, line = 2000000) => {
  const sensors_beacons = input.split("\n").map(parseSensorBeacon);
  const dists = sensors_beacons.map(([s, b]) => dist(s, b));

  const intervals = [];
  for (const [ix, [sensor]] of sensors_beacons.entries()) {
    if (line <= sensor[1] + dists[ix] && line >= sensor[1] - dists[ix]) {
      const diff = Math.abs(line - sensor[1]);

      const from = sensor[0] - dists[ix] + diff;
      const to = sensor[0] + dists[ix] - diff;

      const ix_from = intervals.findIndex(([fromI]) => fromI >= from);

      if (ix_from > -1) {
        intervals.splice(ix_from, 0, [from, to]);
      } else {
        intervals.push([from, to]);
      }
    }
  }

  return merge(intervals).reduce((acc, i) => Math.abs(i[0] - i[1]) + acc, 0);
};

module.exports.part2 = (input, limit = 4000000) => {
  const sensors_beacons = input.split("\n").map(parseSensorBeacon);
  const dists = sensors_beacons.map(([s, b]) => dist(s, b));

  for (let line = 0; line <= limit; line++) {
    const intervals = [];
    for (const [ix, [sensor]] of sensors_beacons.entries()) {
      if (line <= sensor[1] + dists[ix] && line >= sensor[1] - dists[ix]) {
        const diff = Math.abs(line - sensor[1]);

        const from = sensor[0] - dists[ix] + diff;
        const to = sensor[0] + dists[ix] - diff;

        const ix_from = intervals.findIndex(([fromI]) => fromI >= from);

        if (ix_from > -1) {
          intervals.splice(ix_from, 0, [from, to]);
        } else {
          intervals.push([from, to]);
        }
      }
    }

    const merged = merge(intervals);

    let possible_intervals = [[-1, limit + 1]];
    let skipThisLine = false;

    for (const i of merged) {
      possible_intervals = possible_intervals
        .map((init) => {
          init = exclude(init, i);
          return init;
        })
        .flat()
        .filter(Boolean);

      skipThisLine = possible_intervals.length === 0;

      if (skipThisLine) {
        break;
      }
    }

    if (skipThisLine) {
      continue;
    }

    if (
      possible_intervals.length === 1 &&
      possible_intervals[0][1] - possible_intervals[0][0] === 2
    ) {
      return 4000000n * BigInt(possible_intervals[0][0] + 1) + BigInt(line);
    }
  }

  throw new Error("no result");
};
