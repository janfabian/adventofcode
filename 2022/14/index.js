function between([x1, y1], [x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  let xlast = x1;
  let ylast = y1;

  const result = [[xlast, ylast]];

  while (!(xlast === x2 && ylast === y2)) {
    xlast += Math.sign(dx);
    ylast += Math.sign(dy);

    result.push([xlast, ylast]);
  }

  return result;
}

function parseMap(input) {
  const map = input
    .split("\n")
    .map((l) =>
      l.split(" -> ").map((p) => p.split(",").map((n) => parseInt(n)))
    );

  return map;
}

function createWalls(map) {
  const walls = map.reduce((acc, wall) => {
    for (const [ix, p1] of wall.slice(0, -1).entries()) {
      const p2 = wall[ix + 1];
      for (const wallpoint of between(p1, p2)) {
        acc[wallpoint[1]] ||= [];
        acc[wallpoint[1]][wallpoint[0]] = true;
      }
    }

    return acc;
  }, []);

  return walls;
}

function initSand() {
  return [500, 0];
}

function moveSand([x, y], walls) {
  if (!walls[y + 1]?.[x]) {
    return [true, [0, 1]];
  } else if (!walls[y + 1]?.[x - 1]) {
    return [true, [-1, 1]];
  } else if (!walls[y + 1]?.[x + 1]) {
    return [true, [1, 1]];
  }

  return [false, [0, 0]];
}

module.exports.part1 = (input) => {
  const map = parseMap(input);
  const walls = createWalls(map);

  const maxY = walls.length - 1;

  let sand_counter = 0;
  let finished = false;
  let active_sand = initSand();

  while (!finished) {
    const [moved, [dx, dy]] = moveSand(active_sand, walls);
    const new_sand_position = [active_sand[0] + dx, active_sand[1] + dy];

    if (new_sand_position[1] >= maxY) {
      finished = true;
      break;
    }

    if (moved) {
      active_sand = new_sand_position;
    } else {
      walls[new_sand_position[1]] ||= [];
      walls[new_sand_position[1]][new_sand_position[0]] = true;
      active_sand = initSand();
      sand_counter++;
    }
  }

  return sand_counter;
};

module.exports.part2 = (input) => {
  const map = parseMap(input);
  const walls = createWalls(map);

  walls.push([], new Array(1000).fill(true));

  let sand_counter = 0;
  let finished = false;
  let active_sand = initSand();

  while (!finished) {
    const [moved, [dx, dy]] = moveSand(active_sand, walls);
    const new_sand_position = [active_sand[0] + dx, active_sand[1] + dy];

    if (new_sand_position[0] === 500 && new_sand_position[1] === 0) {
      finished = true;
      break;
    }

    if (moved) {
      active_sand = new_sand_position;
    } else {
      walls[new_sand_position[1]] ||= [];
      walls[new_sand_position[1]][new_sand_position[0]] = true;
      active_sand = initSand();
      sand_counter++;
    }
  }

  return sand_counter + 1;
};
