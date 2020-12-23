const INGREDIENTS_REGEXP = /^(.*)\(/;
const ALERGENS_REGEXP = /\(contains (.*)\)/;

const intersection = (a, b) => new Set([...a].filter((x) => b.has(x)));
const union = (a, b) => new Set([...a, ...b]);
const difference = (a, b) => new Set([...a].filter((x) => !b.has(x)));

module.exports.first = (input) => {
  const foods = input
    .trimEnd()
    .split("\n")
    .map((l) => [
      l
        .match(INGREDIENTS_REGEXP)[1]
        .trim()
        .split(" ")
        .map((i) => i.trim()),
      l
        .match(ALERGENS_REGEXP)[1]
        .trim()
        .split(", ")
        .map((i) => i.trim()),
    ])
    .map(([ingredients, alergens]) => [
      new Set(ingredients),
      new Set(alergens),
    ]);

  const originalIngredients = foods.map(
    ([ingredients]) => new Set(ingredients)
  );

  let finished = false;
  let second = {};

  while (!finished) {
    finished = true;

    foods.forEach(([ingredients1, alergens1], i) => {
      foods.forEach(([ingredients2, alergens2], j) => {
        const commonI = intersection(ingredients1, ingredients2);
        const commonA = intersection(alergens1, alergens2);

        if (commonI.size > 0 && commonI.size === commonA.size) {
          finished = false;
          const IToRemove = [...commonI.values()];
          const AToRemove = [...commonA.values()];
          foods.forEach(([ingredients, alergens]) => {
            AToRemove.forEach((a) => alergens.delete(a));
            IToRemove.forEach((i) => ingredients.delete(i));
          });
        }
      });
    });
  }

  finished = false;
  const uncertain = new Map();
  while (!finished) {
    finished = true;

    foods.forEach(([ingredients1, alergens1], i) => {
      if (alergens1.size !== 1) {
        return;
      }
      const A = [...alergens1.values()][0];
      let commonI = ingredients1;
      foods.forEach(([ingredients2, alergens2], j) => {
        if (!alergens2.has(A)) {
          return;
        }

        commonI = intersection(commonI, ingredients2);
      });
      if (commonI.size === 1) {
        finished = false;
        const IToRemove = [...commonI.values()];
        const AToRemove = [A];
        second[A] = IToRemove;
        foods.forEach(([ingredients, alergens]) => {
          AToRemove.forEach((a) => alergens.delete(a));
          IToRemove.forEach((i) => ingredients.delete(i));
        });
      } else {
        uncertain.set(A, commonI);
      }
    });
  }

  for (const [a1, i1] of uncertain.entries()) {
    for (const [a2, i2] of uncertain.entries()) {
      let diff = difference(i1, i2);
      if (diff.size === 1) {
        const IToRemove = [...diff.values()];
        const AToRemove = [a1];
        // second[a1] = IToRemove;
        foods.forEach(([ingredients, alergens]) => {
          AToRemove.forEach((a) => alergens.delete(a));
          IToRemove.forEach((i) => ingredients.delete(i));
        });
      }
    }
  }

  finished = false;

  while (!finished) {
    finished = true;

    foods.forEach(([ingredients1, alergens1], i) => {
      foods.forEach(([ingredients2, alergens2], j) => {
        if (i === j) {
          return;
        }

        const diffI = difference(ingredients1, ingredients2);

        if (diffI.size > 0 && diffI.size === alergens1.size) {
          finished = false;

          const IToRemove = [...diffI.values()];
          const AToRemove = [...alergens1.values()];
          // second[AToRemove[0]] = IToRemove[0];
          foods.forEach(([ingredients, alergens]) => {
            AToRemove.forEach((a) => alergens.delete(a));
            IToRemove.forEach((i) => ingredients.delete(i));
          });
        }
      });
    });
  }

  const withoutAlergens = foods.reduce(
    (res, [ingredients]) => union(res, ingredients),
    new Set()
  );

  return [
    originalIngredients.reduce(
      (s, i) => s + intersection(i, withoutAlergens).size,
      0
    ),
    Object.keys(second)
      .sort()
      .map((a) => second[a])
      .join(","),
  ];
};
