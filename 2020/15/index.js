const NUM_OF_ROUNDS = 2020;
const BUCKET_SIZE = 100000;
const process = (input, numOfRounds = NUM_OF_ROUNDS) => {
  const lastUsage = [];
  const startingNumbers = input.trimEnd().split(",");

  const result = Array(numOfRounds)
    .fill(null)
    .reduce((last, v, i) => {
      let bucketLastUsage = lastUsage[Math.floor(last / BUCKET_SIZE)];
      if (!bucketLastUsage) {
        bucketLastUsage = lastUsage[Math.floor(last / BUCKET_SIZE)] = {};
      }
      const prevLast = bucketLastUsage[last];
      bucketLastUsage[last] = i;

      if (i < startingNumbers.length) {
        return startingNumbers[i];
      }
      if (prevLast == null) {
        return 0;
      }

      return i - prevLast;
    }, startingNumbers[0]);

  return result;
};

module.exports.first = process;
module.exports.second = (input) => process(input, 30000000);
