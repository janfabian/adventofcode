module.exports = (input) => {
  let numbers = input
    .trimEnd()
    .split("\n")
    .map((n) => parseInt(n))
    .sort((a, b) => a - b);

  numbers = [...numbers, numbers[numbers.length - 1] + 3];

  const diff = numbers.map((n, i) => n - (numbers[i - 1] || 0));

  const [ones, threes] = diff.reduce(
    ([ones, threes], v) => [
      ones + (v === 1 ? 1 : 0),
      threes + (v === 3 ? 1 : 0),
    ],
    [0, 0]
  );

  const cache = {};
  const combinations = (function iterate(arrangment) {
    if (cache[arrangment.join("")]) {
      return cache[arrangment.join("")];
    }

    const result = arrangment.reduce((arrangmentSum, n, i) => {
      if (n + arrangment[i + 1] < 4) {
        const newArrangment = arrangment.slice(i + 1);
        newArrangment[0] += arrangment[i];
        return arrangmentSum + iterate(newArrangment);
      }
      return arrangmentSum;
    }, 1);

    cache[arrangment.join("")] = result;

    return result;
  })(diff);

  return [ones * threes, combinations];
};
