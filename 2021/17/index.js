module.exports.part1 = (input) => {
  const [min_y, max_y] = input.match(/y=(.*)/)[1].split("..");

  const y = Math.max(Math.abs(min_y), Math.abs(max_y)) - 1;

  return (y * (y + 1)) / 2;
};

const optionally_add_to_set = (map, key, v) => {
  map[key] = map[key] || new Set();
  map[key].add(v);
};

const find_key_smaller = (map, key) => {
  return Object.keys(map).filter((k) => parseInt(k) <= parseInt(key));
};

const to_id = (a, b) => `${a},${b}`;

const cartesian_func = (xs, ys, f) => {
  [...ys].forEach((y) => {
    [...xs].forEach((x) => {
      f(x, y);
    });
  });
};

module.exports.part2 = (input) => {
  const [min_x, max_x] = input.match(/x=(.*),/)[1].split("..");
  const [min_y, max_y] = input.match(/y=(.*)/)[1].split("..");

  const x_steps_k = {};
  const x_steps_k_more = {};
  const y_steps_k = {};

  for (let ix = 0; ix <= max_x; ix++) {
    let counter = 0;
    let sum = 0;
    for (let x = ix; x >= 0; x--) {
      counter++;
      sum += x;
      if (sum >= min_x && sum <= max_x) {
        if (x === 0) {
          optionally_add_to_set(x_steps_k_more, counter, ix);
        } else {
          optionally_add_to_set(x_steps_k, counter, ix);
        }
      }
      if (sum > max_x) {
        break;
      }
    }
  }

  for (let iy = Math.abs(min_y) - 1; iy >= min_y; iy--) {
    let y = iy;
    let counter = 0;
    let sum = 0;

    while (sum >= min_y) {
      counter++;
      sum += y;

      if (sum >= min_y && sum <= max_y) {
        optionally_add_to_set(y_steps_k, counter, iy);
      }

      y--;
    }
  }

  return Object.entries(y_steps_k).reduce((set, [steps, ys]) => {
    const xs = x_steps_k[steps] || [];
    cartesian_func(xs, ys, (x, y) => set.add(to_id(x, y)));

    find_key_smaller(x_steps_k_more, steps).forEach((k) => {
      const xs = x_steps_k_more[k];
      cartesian_func(xs, ys, (x, y) => set.add(to_id(x, y)));
    });

    return set;
  }, new Set()).size;
};
