const parseFields = (fieldsInput) => {
  return fieldsInput.split("\n").map((fieldLine) => {
    let [field, ints] = fieldLine.split(":");
    ints = ints.split(" or ").map((interval) => {
      const i = interval.trim().match(/\d+/g);
      return [parseInt(i[0]), parseInt(i[1])];
    });

    return [field, ints];
  });
};

const parseTickets = (ticketInput) =>
  ticketInput
    .split("\n")
    .slice(1)
    .map((ticketLine) => ticketLine.split(",").map((n) => parseInt(n.trim())));

const isInIntervals = (n, intervals) =>
  intervals.findIndex((i) => i[0] <= n && n <= i[1]) > -1;

const processInput = (input) => {
  const [
    fieldsInput,
    yourTicketInput,
    otherTicketsInput,
  ] = input.trimEnd().split("\n\n");

  const fields = parseFields(fieldsInput);
  const intervals = fields.reduce((res, f) => [...res, ...f[1]], []);
  const yourTicket = parseTickets(yourTicketInput)[0];
  const otherTickets = parseTickets(otherTicketsInput);

  return { fields, intervals, yourTicket, otherTickets };
};

module.exports.first = (input) => {
  const { intervals, otherTickets } = processInput(input);

  return otherTickets.reduce(
    (sum, t) =>
      sum +
      t.filter((n) => !isInIntervals(n, intervals)).reduce((s, n) => s + n, 0),
    0
  );
};

const intersection = (a, b) => new Set([...a].filter((x) => b.has(x)));
const difference = (a, b) => new Set([...a].filter((x) => !b.has(x)));

module.exports.second = (input) => {
  let { fields, intervals, yourTicket, otherTickets } = processInput(input);
  let possible = Array(fields.length).fill(new Set(fields.map(([n]) => n)));

  otherTickets
    .filter((t) => t.findIndex((n) => !isInIntervals(n, intervals)) === -1)
    .forEach((t) => {
      t.forEach((n, i) => {
        const possibleForTicket = new Set();

        possible[i].forEach((fieldName) => {
          const [, intervals] = fields.find(([n]) => n === fieldName);
          if (isInIntervals(n, intervals)) {
            possibleForTicket.add(fieldName);
          }
        });

        possible[i] = intersection(possible[i], possibleForTicket);

        const oneItemSetToProcess = [];

        if (possible[i].size === 1) {
          oneItemSetToProcess.push(i);
        }

        while (oneItemSetToProcess.length > 0) {
          const i = oneItemSetToProcess.pop();
          const processing = possible[i];

          possible = possible.map((p, j) => {
            if (j === i) {
              return p;
            } else if (p.size === 1) {
              return p;
            }

            const diff = difference(p, processing);
            if (diff.size === 1) {
              oneItemSetToProcess.push(j);
            }

            return diff;
          });
        }
      });
    });

  return yourTicket.reduce((product, n, i) => {
    if ([...possible[i]][0].startsWith("departure")) {
      return product * n;
    }
    return product;
  }, 1);
};
