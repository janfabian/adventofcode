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
        }

        const possible_rate =
          current_rate +
          Math.max(0, remaining_steps - 1) *
            Number(!getBit(opened, BigInt(n))) *
            graph[n][0];

        if (max[n] <= possible_rate) {
          to_visit.push([n, current_rate, opened]);
        }
      }
    }
  }

  return max.reduce((acc, n) => Math.max(acc, n), 0);
};

module.exports.part2 = (input) => {
  const nodesMap = createNodeMap(input);
  const graph = input
    .split("\n")
    .map((l) => parseLine(l, nodesMap))
    .map(([i, n], ix) => [i, n.concat(ix)]);

  const step_n = 26;

  const to_visit = [
    [
      nodesMap["AA"] + "_" + nodesMap["AA"] + "_",
      nodesMap["AA"],
      nodesMap["AA"],
      0,
      0n,
    ],
  ];
  const max = new Array(graph.length).fill(-1);
  const visited_path = new Set();
  for (let ix = 1; ix <= step_n; ix++) {
    const remaining_steps = step_n - ix;
    const to_visit_length = to_visit.length;

    console.log({ ix, max, to_visit_length, visited_path: visited_path });

    if (ix === 4) {
      return;
    }

    for (let iy = 0; iy < to_visit_length; iy++) {
      const [path, nodeId, nodeIdEl, rate, _opened] = to_visit.shift();
      const neighbours = graph[nodeId][1];
      const neighboursEl = graph[nodeIdEl][1];
      let opened = _opened;

      for (const n of neighbours) {
        let current_rate = rate;

        if (n === nodeId && !getBit(opened, BigInt(n))) {
          current_rate += graph[n][0] * remaining_steps;
          opened = setBit(opened, BigInt(n));
        }

        for (const nEl of neighboursEl) {
          let current_rate_el = current_rate;
          let opened_el = opened;

          if (nEl === nodeId && !getBit(opened_el, BigInt(nEl))) {
            current_rate_el += graph[nEl][0] * remaining_steps;
            opened_el = setBit(opened_el, BigInt(nEl));
          }

          if (max[n] < current_rate_el) {
            max[n] = current_rate_el;
          }

          if (max[nEl] < current_rate_el) {
            max[nEl] = current_rate_el;
          }

          const possible_rate =
            current_rate_el +
            Math.max(0, remaining_steps - 1) *
              Number(!getBit(opened_el, BigInt(n))) *
              graph[n][0] +
            Math.max(0, remaining_steps - 1) *
              Number(!getBit(opened_el, BigInt(nEl))) *
              graph[nEl][0];

          if (max[n] <= possible_rate || max[nEl] <= possible_rate) {
            if (
              !visited_path.has(path + `${n}_${nEl}_`) &&
              !visited_path.has(path + `${nEl}_${n}_`)
            ) {
              // console.log(path + `${n}_${nEl}_`);
              // console.log(max[n], max[nEl]);
              // console.log({ current_rate_el, possible_rate });

              visited_path.add(path + `${n}_${nEl}_`);
              to_visit.push([
                path + `${n}_${nEl}_`,
                n,
                nEl,
                current_rate_el,
                opened_el,
              ]);
            }
          }
        }
      }
    }
  }

  return max.reduce((acc, n) => Math.max(acc, n), 0);
};
