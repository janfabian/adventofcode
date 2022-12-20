function mod(n, m) {
  return ((n % m) + m) % m;
}

function mixedIx(ix, n, l) {
  return mod(ix + n, l) || l;
}

function createSubIndex(ns) {
  const c = {};
  const res = [];
  for (const [ix, n] of ns.entries()) {
    c[n] ||= 0;
    res[ix] = [n, c[n]++];
  }

  return res;
}

function encode([v, si]) {
  return `${v}_${si}`;
}

module.exports.part1 = (input) => {
  let ns = input.split("\n").map((n) => parseInt(n));

  ns = createSubIndex(ns);

  const order = ns.reduce((acc, n, ix) => {
    acc[encode(n)] = ix;
    return acc;
  }, []);

  const l = ns.length - 1;

  for (const n of [...ns]) {
    if (n[0] === 0) {
      continue;
    }

    const encoded = encode(n);

    const to = mixedIx(order[encoded], n[0], l);
    const from = order[encoded];

    if (from === to) {
      continue;
    }

    if (from < to) {
      for (let i = from + 1; i <= to; i++) {
        const c = ns[i];

        ns[--order[encode(c)]] = c;
      }
    }

    if (from > to) {
      for (let i = from - 1; i >= to; i--) {
        const c = ns[i];

        ns[++order[encode(c)]] = c;
      }
    }

    ns[to] = n;
    order[encode(n)] = to;
  }

  return (
    ns[mod(order["0_0"] + mod(1000, ns.length), ns.length)][0] +
    ns[mod(order["0_0"] + mod(2000, ns.length), ns.length)][0] +
    ns[mod(order["0_0"] + mod(3000, ns.length), ns.length)][0]
  );
};

module.exports.part2 = (input) => {
  let ns = input.split("\n").map((n) => parseInt(n) * 811589153);

  ns = createSubIndex(ns);

  const order = ns.reduce((acc, n, ix) => {
    acc[encode(n)] = ix;
    return acc;
  }, []);

  const l = ns.length - 1;
  const orig_ns = [...ns];

  for (let i = 0; i < 10; i++) {
    for (const n of orig_ns) {
      if (n[0] === 0) {
        continue;
      }

      const encoded = encode(n);

      const to = mixedIx(order[encoded], n[0], l);
      const from = order[encoded];

      if (from === to) {
        continue;
      }

      if (from < to) {
        for (let i = from + 1; i <= to; i++) {
          const c = ns[i];

          ns[--order[encode(c)]] = c;
        }
      }

      if (from > to) {
        for (let i = from - 1; i >= to; i--) {
          const c = ns[i];

          ns[++order[encode(c)]] = c;
        }
      }

      ns[to] = n;
      order[encode(n)] = to;
    }
  }

  return (
    ns[mod(order["0_0"] + mod(1000, ns.length), ns.length)][0] +
    ns[mod(order["0_0"] + mod(2000, ns.length), ns.length)][0] +
    ns[mod(order["0_0"] + mod(3000, ns.length), ns.length)][0]
  );
};
