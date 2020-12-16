const process = {
  mask: (line) => line.substring(7),
  memory: (line) => {
    const address = BigInt(line.match(/\[(\d+)\]/)[1]);
    const value = BigInt(line.match(/(\d+)$/)[1]);

    return [address, value];
  },
};

module.exports.first = (input) => {
  const memory = {};
  input
    .trimEnd()
    .split("\n")
    .reduce((mask, line) => {
      if (line.startsWith("mask")) {
        return process.mask(line);
      } else if (line.startsWith("mem")) {
        let [address, value] = process.memory(line);
        value |= BigInt("0b" + mask.replace(/X/g, "0"), 2);
        value &= BigInt("0b" + mask.replace(/X/g, "1"), 2);
        memory[address] = value;
      } else {
        throw new Error("unknown command line: " + line);
      }

      return mask;
    }, Array(32).fill("X").join(""));

  return Object.values(memory).reduce((s, a) => s + a, BigInt(0));
};

const addressCombinations = (address) => {
  const queue = [address];
  const result = [];
  while (queue.length > 0) {
    const a = queue.splice(0, 1)[0];
    let r = "";
    for (const b of a) {
      if (b === "X") {
        queue.push(r + "1" + a.substring(r.length + 1));
        r += "0";
      } else {
        r += b;
      }
    }
    result.push(r);
  }

  return result;
};

module.exports.second = (input) => {
  const memory = {};
  input
    .trimEnd()
    .split("\n")
    .reduce((mask, line) => {
      if (line.startsWith("mask")) {
        return process.mask(line);
      } else if (line.startsWith("mem")) {
        let [address, value] = process.memory(line);
        let newAddress = (address | BigInt("0b" + mask.replace(/X/g, "0"), 2))
          .toString(2)
          .padStart(36, "0");

        newAddress = [...newAddress]
          .map((b, i) => {
            if (mask[i] === "X") {
              return "X";
            }
            return b;
          })
          .join("");

        const addresses = addressCombinations(newAddress);
        for (const a of addresses) {
          memory[BigInt("0b" + a, 2)] = value;
        }
      } else {
        throw new Error("unknown command line: " + line);
      }

      return mask;
    }, null);

  return Object.values(memory).reduce((s, a) => s + a, BigInt(0));
};
