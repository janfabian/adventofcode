const ACTIVE = "#";
const INACTIVE = ".";
const NUM_OF_CYCLES = 6;

const vectors = (() => {
  const base = [-1, 0, 1];
  const result = [];
  base.forEach((x) => {
    base.forEach((y) => {
      base.forEach((z) => {
        if (x === 0 && y === 0 && z === 0) {
          return;
        }

        result.push([x, y, z]);
        return;
      });
    });
  });

  return result;
})();

const print = (grid) => {
  grid.forEach((z) => {
    z.forEach((y) => {
      console.log(y.reduce((line, x) => line + x, ""));
    });
    console.log("=======");
  });
};

const OFFSET = 10;

const offset = ([x, y, z]) => [x + OFFSET, y + OFFSET, z + OFFSET];

const getPoint = ([x, y, z], grid) => {
  [x, y, z] = offset([x, y, z]);
  return ((grid[z] || [])[y] || [])[x] || INACTIVE;
};
const setPoint = (value, [x, y, z], grid) => {
  [x, y, z] = offset([x, y, z]);
  grid[z] = grid[z] || [];
  grid[z][y] = grid[z][y] || [];
  grid[z][y][x] = value;
};

const sum = ([x1, y1, z1], [x2, y2, z2]) => [x1 + x2, y1 + y2, z1 + z2];

const getActiveAround = ([x, y, z], grid) => {
  return vectors.reduce((activeAround, [vx, vy, vz]) => {
    const p = getPoint(sum([x, y, z], [vx, vy, vz]), grid);
    if (p === ACTIVE) {
      return activeAround + 1;
    }
    return activeAround;
  }, 0);
};

module.exports = (input) => {
  const rows = input
    .trimEnd()
    .split("\n")
    .map((r) => r.split(""));
  let gridWithoutOffset = [rows];

  let grid = [];

  gridWithoutOffset.forEach((z, zx) => {
    z.forEach((y, yx) => {
      y.forEach((x, xx) => {
        setPoint(x, [xx, yx, zx], grid);
      });
    });
  });

  for (let cycle = 1; cycle <= NUM_OF_CYCLES; cycle++) {
    let updatedGrid = [];
    for (let z = -cycle; z <= cycle; z++) {
      for (let y = -cycle; y < rows.length + cycle; y++) {
        for (let x = -cycle; x < rows[0].length + cycle; x++) {
          const activeAround = getActiveAround([x, y, z], grid);
          const p = getPoint([x, y, z], grid);
          if (p === ACTIVE) {
            if (![2, 3].includes(activeAround)) {
              setPoint(INACTIVE, [x, y, z], updatedGrid);
              continue;
            }
          } else {
            if (activeAround === 3) {
              setPoint(ACTIVE, [x, y, z], updatedGrid);
              continue;
            }
          }
          setPoint(p, [x, y, z], updatedGrid);
        }
      }
    }
    grid = updatedGrid;
  }

  return grid.reduce((sum, z) => {
    z.forEach((y) => {
      y.forEach((x) => {
        if (x === ACTIVE) {
          sum += 1;
        }
      });
    });
    return sum;
  }, 0);
};
