const dirs = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

function findMin(cubes) {
  return cubes.reduce(
    ([mx, my, mz], [x, y, z]) => [
      Math.min(mx, x),
      Math.min(my, y),
      Math.min(mz, z),
    ],
    [Infinity, Infinity, Infinity]
  );
}

function findMax(cubes) {
  return cubes.reduce(
    ([mx, my, mz], [x, y, z]) => [
      Math.max(mx, x),
      Math.max(my, y),
      Math.max(mz, z),
    ],
    [-Infinity, -Infinity, -Infinity]
  );
}

function encode([x, y, z]) {
  return `${x}_${y}_${z}`;
}

function tryEscape(
  p,
  [min_x, min_y, min_z],
  [max_x, max_y, max_z],
  map,
  visited_prev,
  cant_escapes_prev
) {
  const to_visit = [p];
  const visited = new Set();

  while (to_visit.length > 0) {
    const [x, y, z] = to_visit.shift();

    if (visited_prev.has(encode([x, y, z]))) {
      return [true, visited];
    }

    if (cant_escapes_prev.has(encode([x, y, z]))) {
      return [false, visited];
    }

    if (
      x < min_x ||
      y < min_y ||
      z < min_z ||
      x > max_x ||
      y > max_y ||
      z > max_z
    ) {
      return [true, visited];
    }

    for (const [dx, dy, dz] of dirs) {
      const n = [dx + x, dy + y, dz + z];
      if (map[n[2]]?.[n[1]]?.[n[0]]) {
        continue;
      }

      if (!visited.has(encode(n))) {
        visited.add(encode(n));
        to_visit.push(n);
      }
    }
  }

  return [false, visited];
}

function parseCubes(input) {
  return input.split("\n").map((l) => l.split(",").map((n) => parseInt(n)));
}

function createMap(cubes) {
  const map = [];

  for (const [x, y, z] of cubes) {
    map[z] ||= [];
    map[z][y] ||= [];
    map[z][y][x] = true;
  }

  return map;
}

function calcSides(cubes, map) {
  let result = 0;
  for (const cube of cubes) {
    const sides = 6 - connectedSides(cube, map);

    result += sides;
  }

  return result;
}

function connectedSides([x, y, z], map) {
  return dirs.filter(([dx, dy, dz]) => map[dz + z]?.[dy + y]?.[dx + x]).length;
}

module.exports.part1 = (input) => {
  const cubes = parseCubes(input);
  const map = createMap(cubes);

  return calcSides(cubes, map);
};

module.exports.part2 = (input) => {
  const cubes = parseCubes(input);
  const map = createMap(cubes);

  const min = findMin(cubes);
  const max = findMax(cubes);

  let sides = calcSides(cubes, map);

  let escapes = new Set();
  let cant_escapes = new Set();

  for (let x = min[0]; x <= max[0]; x++) {
    for (let y = min[1]; y <= max[1]; y++) {
      for (let z = min[2]; z <= max[2]; z++) {
        const is_empty = !map[z]?.[y]?.[x];

        if (is_empty) {
          if (escapes.has(encode([x, y, z]))) {
            continue;
          }

          if (cant_escapes.has(encode([x, y, z]))) {
            const unreachable_sides = connectedSides([x, y, z], map);
            sides -= unreachable_sides;
            continue;
          }

          const [can_escape, visited] = tryEscape(
            [x, y, z],
            min,
            max,
            map,
            escapes,
            cant_escapes
          );

          if (can_escape) {
            escapes = new Set([...escapes, ...visited]);
          } else {
            cant_escapes = new Set([...cant_escapes, ...visited]);
            const unreachable_sides = connectedSides([x, y, z], map);
            sides -= unreachable_sides;
          }
        }
      }
    }
  }

  return sides;
};
