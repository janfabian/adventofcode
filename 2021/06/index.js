const { debug } = require("../../lib/utils");

const REPRODUCTION_DAYS = 6;
const MAX_EPOCHS = 257;

const reproduction = (fish, days_new_total, num = 1, initial_ix = 0) => {
  for (let ix = 0; ix < MAX_EPOCHS; ix++) {
    if (ix + initial_ix + 1 >= MAX_EPOCHS) {
      return;
    }
    const n =
      REPRODUCTION_DAYS -
      ((ix + (REPRODUCTION_DAYS - fish)) % (REPRODUCTION_DAYS + 1));

    if (n === 0) {
      days_new_total[initial_ix + ix + 1] += BigInt(num);
    }
  }
};

module.exports = (input) => {
  const initialState = input.split(",").map((n) => parseInt(n));
  const days_new_gen = Array(MAX_EPOCHS).fill(BigInt(0));

  initialState.forEach((fish) => {
    reproduction(fish, days_new_gen);
  });

  for (let ix = 0; ix < MAX_EPOCHS; ix++) {
    const newGen = days_new_gen[ix];
    if (newGen === 0) {
      continue;
    }
    reproduction(8, days_new_gen, newGen, ix);
  }

  return (
    days_new_gen.reduce((t, n) => (t += n), BigInt(0)) +
    BigInt(initialState.length)
  );
};
