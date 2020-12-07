const sanitize = (rule) => {
  return rule.replace(/(no other )?bag(s)?(\.)?/g, "").trim();
};

const getBag = (bags, bag) => {
  if (!bags[bag]) {
    bags[bag] = {
      parents: [],
      children: [],
      c_n: [],
      bag,
    };
  }

  return bags[bag];
};

const MY_BAG_NAME = "shiny gold";

module.exports = (input) => {
  const bags = {};

  input
    .trimEnd()
    .split("\n")
    .forEach((rule) => {
      const [parentRule, childrenRule] = rule.split("contain");
      const childrenNames = childrenRule
        .split(",")
        .map(sanitize)
        .map((rule) => rule.split(" "))
        .filter((r) => r.length > 0 && r[0] !== "")
        .map(([n, ...name]) => [parseInt(n), name.join(" ")]);

      const parentName = sanitize(parentRule);

      const parent = getBag(bags, parentName);

      childrenNames.forEach(([n, c]) => {
        const child = getBag(bags, c);
        child.parents.push(parent);
        parent.children.push(child);
        parent.c_n.push(n);
      });
    });

  const myBag = getBag(bags, MY_BAG_NAME);

  const parentsToVisit = myBag.parents.map(({ bag }) => bag);
  const visitedParents = new Set();
  let i = 0;
  while (parentsToVisit.length > 0) {
    const v = parentsToVisit.pop();
    if (visitedParents.has(v)) {
      continue;
    }
    getBag(bags, v).parents.forEach((p) => parentsToVisit.push(p.bag));
    visitedParents.add(v);
    i++;
  }

  const childrenToVisit = myBag.children.map(({ bag }, i) => [
    bag,
    myBag.c_n[i],
  ]);
  let j = 0;
  while (childrenToVisit.length > 0) {
    const [v, m] = childrenToVisit.pop();
    const currentBag = getBag(bags, v);
    currentBag.children.forEach((p, i) =>
      childrenToVisit.push([p.bag, m * currentBag.c_n[i]])
    );
    j += m;
  }

  return [i, j];
};
