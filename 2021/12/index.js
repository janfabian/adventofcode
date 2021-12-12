const { debug } = require("../../lib/utils");

const START = "start";
const END = "end";

const isLowerCase = (node) =>
  !isUpperCase(node) && !isStart(node) && !isEnd(node);
const isUpperCase = (node) =>
  !node.split("").some((c) => c !== c.toUpperCase());
const isStart = (node) => node === START;
const isEnd = (node) => node === END;

const union = (a, b = new Set()) => new Set([...a, ...b]);

const parse = (input) =>
  input.split("\n").reduce((map, row) => {
    const [from, to] = row.split("-");
    map[from] = map[from] || new Set();
    map[to] = map[to] || new Set();
    map[from].add(to);
    map[to].add(from);

    return map;
  }, {});

module.exports.part1 = (input) => {
  const map = parse(input);

  const paths_confs = [...map[START]].map((node) => {
    return [[START, node], new Set([isUpperCase(node) ? null : node])];
  });

  let result = 0;

  while (paths_confs.length) {
    for (let ix = 0; ix < paths_confs.length; ix++) {
      const [[path, visited_lower_case]] = paths_confs.splice(ix, 1);

      const last_node = path[path.length - 1];

      if (isEnd(last_node)) {
        result++;
        continue;
      }

      [...map[last_node]]
        .filter((node) => !visited_lower_case.has(node))
        .filter((node) => !isStart(node))
        .forEach((visitable_node) => {
          paths_confs.push([
            [...path, visitable_node],
            union(visited_lower_case, [
              isUpperCase(visitable_node) ? null : visitable_node,
            ]),
          ]);
        });
    }
  }

  return result;
};

module.exports.part2 = (input) => {
  const map = parse(input);

  const paths_confs = [...map[START]].reduce((res, node) => {
    res.push([[START, node], new Set([isUpperCase(node) ? null : node]), null]);

    if (isLowerCase(node)) {
      res.push([[START, node], new Set([node]), [node, 1]]);
    }

    return res;
  }, []);

  let result = 0;

  while (paths_confs.length) {
    for (let ix = 0; ix < paths_confs.length; ix++) {
      const [[path, visited_lower_case, twice_possible]] = paths_confs.splice(
        ix,
        1
      );

      const last_node = path[path.length - 1];

      if (isEnd(last_node)) {
        if (!twice_possible || twice_possible[1] > 1) {
          result++;
        }
        continue;
      }

      [...map[last_node]]
        .filter((node) => !isStart(node))
        .filter((node) => {
          if (isUpperCase(node)) {
            return true;
          }

          if (!visited_lower_case.has(node)) {
            return true;
          } else if (
            twice_possible &&
            twice_possible[0] === node &&
            twice_possible[1] < 2
          ) {
            return true;
          }

          return false;
        })
        .forEach((visitable_node) => {
          let twice_possible_copy = twice_possible;
          if (
            twice_possible_copy &&
            twice_possible_copy[0] === visitable_node
          ) {
            twice_possible_copy = [twice_possible[0], twice_possible[1] + 1];
          }
          paths_confs.push([
            [...path, visitable_node],
            union(visited_lower_case, [
              isUpperCase(visitable_node) ? null : visitable_node,
            ]),
            twice_possible_copy,
          ]);
          if (twice_possible == null && isLowerCase(visitable_node)) {
            paths_confs.push([
              [...path, visitable_node],
              union(visited_lower_case, [visitable_node]),
              [visitable_node, 1],
            ]);
          }
        });
    }
  }

  return result;
};
