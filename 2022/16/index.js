function parseLine(line, nodesMap) {
  let ix = line.indexOf("; tunnels lead to valves ");
  let neighbours_ix = ix + 25;

  if (ix < 0) {
    ix = line.indexOf("; tunnel leads to valve ");
    neighbours_ix = ix + 24;
  }

  const rate = parseInt(line.slice(23, ix));
  const neighbours = line
    .slice(neighbours_ix)
    .split(", ")
    .map((n) => nodesMap[n]);

  return [rate, neighbours];
}

function createNodeMap(input) {
  return input
    .split("\n")
    .map((l) => l.slice(6, 8))
    .reduce(
      (acc, n, i) => ({
        ...acc,
        [n]: i,
      }),
      {}
    );
}

function setBit(n, i) {
  return (1n << i) | n;
}

function getBit(n, i) {
  return (n >> i) & 1n;
}

module.exports.part1 = (input) => {
  const nodesMap = createNodeMap(input);
  const graph = input
    .split("\n")
    .map((l) => parseLine(l, nodesMap))
    .map(([i, n], ix) => [i, n.concat(ix)]);

  const step_n = 30;

  const to_visit = [[nodesMap["AA"], 0, 0n]];
  const max = new Array(graph.length).fill(-1);

  for (let ix = 1; ix <= step_n; ix++) {
    const remaining_steps = step_n - ix;
    const to_visit_length = to_visit.length;
    for (let iy = 0; iy < to_visit_length; iy++) {
      const [nodeId, rate, _opened] = to_visit.shift();
      const neighbours = graph[nodeId][1];
      let opened = _opened;

      for (const n of neighbours) {
        let current_rate = rate;

        if (n === nodeId && !getBit(opened, BigInt(n))) {
          current_rate += graph[n][0] * remaining_steps;
          opened = setBit(opened, BigInt(n));
        }

        if (max[n] <= current_rate) {
          max[n] = current_rate;
          to_visit.push([n, current_rate, opened]);
        }
      }
    }
  }

  return max.reduce((acc, n) => Math.max(acc, n), 0);
};
