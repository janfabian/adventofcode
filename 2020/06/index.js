const numOfBitOnes = (n) => [...n.toString(2)].filter((i) => i == 1).length;

module.exports = (input) => {
  return input
    .trimEnd()
    .split("\n\n")
    .map((group) => group.split("\n"))
    .map((group) =>
      group.map((member) =>
        [...member].reduce((sum, s) => sum | (1 << (s.charCodeAt() - 97)), 0)
      )
    )
    .map((memberAnswers) =>
      memberAnswers.reduce(
        ([each, some], answer) => [each & answer, some | answer],
        [memberAnswers[0], memberAnswers[0]]
      )
    )
    .map(([eachBitMask, someBitMask]) => [
      numOfBitOnes(eachBitMask),
      numOfBitOnes(someBitMask),
    ])
    .reduce(
      ([eachSum, someSum], [each, some]) => [eachSum + each, someSum + some],
      [0, 0]
    );
};
