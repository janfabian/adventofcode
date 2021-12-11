const incr_epoch = (epoch) => {
  for (let iy = 0; iy < epoch.length; iy++) {
    for (let ix = 0; ix < epoch[iy].length; ix++) {
      epoch[iy][ix]++;
    }
  }
};

const flash_epoch = (epoch) => {
  const to_flash = [];
  for (let iy = 0; iy < epoch.length; iy++) {
    for (let ix = 0; ix < epoch[iy].length; ix++) {
      if (epoch[iy][ix] > 9) {
        to_flash.push([iy, ix]);
      }
    }
  }

  while (to_flash.length) {
    const [iy, ix] = to_flash.pop();

    for (let dy = -1; dy < 2; dy++) {
      for (let dx = -1; dx < 2; dx++) {
        if (dy === 0 && dx === 0) {
          continue;
        }

        if (epoch[iy + dy] != null && epoch[iy + dy][ix + dx] != null) {
          epoch[iy + dy][ix + dx]++;
          if (epoch[iy + dy][ix + dx] === 10) {
            to_flash.push([iy + dy, ix + dx]);
          }
        }
      }
    }
  }
};

const turn_off = (epoch) => {
  let n = 0;
  for (let iy = 0; iy < epoch.length; iy++) {
    for (let ix = 0; ix < epoch[iy].length; ix++) {
      if (epoch[iy][ix] > 9) {
        epoch[iy][ix] = 0;
        n++;
      }
    }
  }

  return n;
};

const NUM_OF_EPOCHS = 100;

module.exports.part1 = (input) => {
  const epoch = input
    .split("\n")
    .map((row) => row.split("").map((n) => parseInt(n)));

  let result = 0;

  for (let i = 0; i < NUM_OF_EPOCHS; i++) {
    incr_epoch(epoch);
    flash_epoch(epoch);
    result += turn_off(epoch);
  }

  return result;
};

const check_null = (epoch) => {
  let result = true;
  for (let iy = 0; iy < epoch.length; iy++) {
    for (let ix = 0; ix < epoch[iy].length; ix++) {
      if (epoch[iy][ix] > 0) {
        result = false;
      }
    }
  }

  return result;
};

module.exports.part2 = (input) => {
  const epoch = input
    .split("\n")
    .map((row) => row.split("").map((n) => parseInt(n)));

  let result = 0;

  while (!check_null(epoch)) {
    incr_epoch(epoch);
    flash_epoch(epoch);
    turn_off(epoch);
    result++;
  }

  return result;
};
