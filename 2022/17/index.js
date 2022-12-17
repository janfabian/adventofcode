function parseStream(input) {
  return input.split("").map((i) => {
    if (i === ">") {
      return 1;
    } else if (i === "<") {
      return -1;
    } else {
      throw new Error("unparsable");
    }
  });
}

const shapes = [
  /*
  ####
  */
  {
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    width: 4,
    height: 1,
  },
  /*
  .#.
  ###
  .#.
  */
  {
    blocks: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    width: 3,
    height: 3,
  },
  /*
  ..#
  ..#
  ###
  */
  {
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    width: 3,
    height: 3,
  },
  /*
  #
  #
  #
  #
  */
  {
    blocks: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    width: 1,
    height: 4,
  },
  /*
  ##
  ##
  */
  {
    blocks: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    width: 2,
    height: 2,
  },
];

function sum(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

let saved_stream_ix;
let saved_height;
let saved_shape_counter;
module.exports.part1 = (input) => {
  const stream = parseStream(input);
  const width = 7;
  let height = 0;
  const initial_pos_d = [2, 3];
  let map = [[undefined, undefined, undefined, true, true, true, true]];
  let stream_ix = 366;
  // let map = [];
  // let stream_ix = 0;
  let shape_ix = 0;
  let shape_counter = 0;

  while (true) {
    if (shape_counter >= 678) {
      break;
    }

    const current_shape = shapes[shape_ix];

    const shape_pos = [0 + initial_pos_d[0], height + initial_pos_d[1]];

    let dir_switch = 0;
    let shape_landed = false;
    while (!shape_landed) {
      let dx = 0;
      let dy = 0;
      if (dir_switch === 0) {
        dx = stream[stream_ix];
        stream_ix = (stream_ix + 1) % stream.length;
      } else {
        dy -= 1;
      }

      shape_pos[0] += dx;
      shape_pos[1] += dy;

      dir_switch = (dir_switch + 1) % 2;

      // too right
      if (shape_pos[0] + current_shape.width > width) {
        shape_pos[0]--;
        continue;
      }

      // too left
      if (shape_pos[0] < 0) {
        shape_pos[0]++;
        continue;
      }

      for (const block of current_shape.blocks) {
        const block_position = sum(shape_pos, block);

        // hit
        if (map[block_position[1]]?.[block_position[0]] || shape_pos[1] < 0) {
          shape_pos[0] -= dx;
          shape_pos[1] -= dy;

          if (dir_switch === 0) {
            shape_landed = true;

            for (const block of current_shape.blocks) {
              const block_position = sum(shape_pos, block);
              map[block_position[1]] ||= [];
              map[block_position[1]][block_position[0]] = true;
            }

            height = Math.max(height, shape_pos[1] + current_shape.height);

            break;
          }
        }
      }
    }

    shape_ix = (shape_ix + 1) % shapes.length;
    shape_counter++;

    if (shape_counter > 1 && shape_ix === 1) {
      if (map[0].toString() === map[height - 1].toString()) {
        if (!saved_stream_ix) {
          saved_stream_ix = stream_ix;
        } else {
          if (saved_stream_ix === stream_ix) {
            console.log({
              height,
              shape_counter,
              saved_stream_ix,
              first_row: map[0],
            });
            if (!isNaN(height - saved_height)) {
              if (!saved_shape_counter) {
                saved_shape_counter = shape_counter;
              } else {
                console.log({
                  diff: height - saved_height,
                  diff_shape: shape_counter - saved_shape_counter,
                });
                saved_shape_counter = shape_counter;
              }
              // console.log({ shape_counter });
              // console.log(shape_counter, height - saved_height);
            }
            saved_height = height;
          }
        }
      }
    }
  }

  return height;
};

// 1589142853960n

// ((1000000000000n - 121n) / 35n) * 53n

// ((1000000000000n - 121n) % 35n)

// 1514285714288n

// ((1000000000000n - shape_counter) / diff_shape) * diff
// + height

// ((1000000000000n - shape_counter) % diff_shape)

// ((1000000000000n - 5321n) / 1750n) * 2781n + 8458n
// ((1000000000000n - 5321n) % 1750n)

// 1589142856066n

// blbe 1589142854406n too low
// blbe 1589142857187n too high

// 1589142857187n