function parseLine(line) {
  const var_name = line.slice(0, 4);

  const expr = line.slice(6);
  const deps = new Set();
  const required_by = new Set();

  const op = ["+", "-", "*", "/"].find((op) => expr.split(op).length === 2);

  let l, r;
  if (op != null) {
    [l, r] = expr
      .split(op)
      .map((n) => n.trim())
      .map((n) => {
        if (isNaN(parseInt(n))) {
          deps.add(n);

          return n;
        } else {
          return BigInt(parseInt(n));
        }
      });
  } else {
    l = BigInt(parseInt(expr));
  }

  return [var_name, op, l, r, deps, required_by];
}

function eval_monkey([op, l, r]) {
  if (!op) {
    return l;
  }

  switch (op) {
    case "+": {
      return l + r;
    }
    case "-": {
      return l - r;
    }
    case "*": {
      return l * r;
    }
    case "/": {
      return l / r;
    }
    default: {
      throw new Error("unknown op " + JSON.stringify({ op, l, r }));
    }
  }
}

module.exports.part1 = (input) => {
  let monkeys = input
    .split("\n")
    .map((n) => parseLine(n))
    .reduce(
      (acc, v) => ({
        ...acc,
        [v[0]]: v,
      }),
      {}
    );

  Object.values(monkeys).forEach(([var_name, , , , deps]) => {
    deps.forEach((d) => {
      monkeys[d][5].add(var_name);
    });
  });

  const monkeys_to_process = Object.values(monkeys)
    .filter(([, , , , deps]) => deps.size === 0)
    .map(([v]) => v);

  const processed = new Set(monkeys_to_process);

  while (monkeys_to_process.length > 0) {
    const m_id = monkeys_to_process.shift();
    const m = monkeys[m_id];
    const r = eval_monkey(m.slice(1, 4));

    m[1] = null;
    m[2] = r;
    m[3] = null;

    m[5].forEach((next) => {
      monkeys[next][4].delete(m_id);

      if (monkeys[next][2] === m_id) {
        monkeys[next][2] = r;
      }
      if (monkeys[next][3] === m_id) {
        monkeys[next][3] = r;
      }

      if (monkeys[next][4].size === 0) {
        if (!processed.has(next)) {
          monkeys_to_process.push(next);
          processed.add(next);
        }
      }
    });

    m[5] = new Set();
  }

  return monkeys["root"][2];
};

module.exports.part2 = (input) => {
  let monkeys = input
    .split("\n")
    .map((n) => parseLine(n))
    .reduce(
      (acc, v) => ({
        ...acc,
        [v[0]]: v,
      }),
      {}
    );

  delete monkeys["humn"];

  Object.values(monkeys).forEach(([var_name, , , , deps]) => {
    deps.forEach((d) => {
      monkeys[d]?.[5]?.add(var_name);
    });
  });

  const monkeys_to_process = Object.values(monkeys)
    .filter(([, , , , deps]) => deps.size === 0)
    .map(([v]) => v);

  const processed = new Set(monkeys_to_process);

  while (monkeys_to_process.length > 0) {
    const m_id = monkeys_to_process.shift();
    const m = monkeys[m_id];
    const r = eval_monkey(m.slice(1, 4));

    m[1] = null;
    m[2] = r;
    m[3] = null;

    m[5].forEach((next) => {
      monkeys[next][4].delete(m_id);

      if (monkeys[next][2] === m_id) {
        monkeys[next][2] = r;
      }
      if (monkeys[next][3] === m_id) {
        monkeys[next][3] = r;
      }

      if (monkeys[next][4].size === 0) {
        if (!processed.has(next)) {
          monkeys_to_process.push(next);
          processed.add(next);
        }
      }
    });

    m[5] = new Set();
  }

  let rev_monkey = monkeys["root"];
  rev_monkey[1] = null;
  const back_p = {};

  while (rev_monkey) {
    if (rev_monkey[4].size !== 1) {
      console.error(rev_monkey);
      throw new Error("unparsable");
    }

    const next = rev_monkey[4].values().next().value;

    let r;

    if (rev_monkey[2] === next) {
      const n = rev_monkey[3];
      r = n;
      const v = back_p[rev_monkey[0]];
      switch (rev_monkey[1]) {
        case "+": {
          r = v - n;
          break;
        }
        case "-": {
          r = v + n;
          break;
        }
        case "*": {
          r = v / n;
          break;
        }
        case "/": {
          r = v * n;
          break;
        }
      }
    } else {
      const n = rev_monkey[2];
      r = n;
      const v = back_p[rev_monkey[0]];
      switch (rev_monkey[1]) {
        case "+": {
          r = v - n;
          break;
        }
        case "-": {
          r = n - v;
          break;
        }
        case "*": {
          r = v / n;
          break;
        }
        case "/": {
          r = n / v;
          break;
        }
      }
    }

    back_p[next] = r;
    rev_monkey = monkeys[next];
  }

  return back_p["humn"];
};
