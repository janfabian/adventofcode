const LITERAL_VALUE = 4;

const from_hex_to_binary = (input) =>
  input
    .split("")
    .map((n) => parseInt(n, 16).toString(2).padStart(4, "0"))
    .join("")
    .split("");

const from_binary_to_big_int = (input) => {
  let result = BigInt(0);
  for (let ix = input.length - 1; ix >= 0; ix -= 1) {
    result += BigInt(input[ix]) * BigInt(2) ** BigInt(input.length - 1 - ix);
  }

  return result;
};

const parse_literal = (literal) => {
  let finish = false;

  let result = "";
  let l = 0;
  while (!finish) {
    const subpacket = literal.splice(0, 5);
    const [[first]] = subpacket.splice(0, 1);

    finish = !parseInt(first, "2");

    result += subpacket.join("");
    l += 5;
  }

  return [result, l];
};

const parse_operator = (literal) => {
  let [length_type] = literal.splice(0, 1);

  length_type = Boolean(parseInt(length_type, "2"));

  if (length_type) {
    let number_of_subpackets = literal.splice(0, 11).join("");
    number_of_subpackets = parseInt(number_of_subpackets, "2");
    const result = [];
    let l = 0;

    while (number_of_subpackets--) {
      const [_result, _l] = parse_packet(literal);
      result.push(_result);
      l += _l;
    }
    return [result, l + 1 + 11];
  } else {
    let total_length_subpackets = literal.splice(0, 15).join("");
    total_length_subpackets = parseInt(total_length_subpackets, "2");
    const orig = total_length_subpackets;
    const result = [];

    while (total_length_subpackets) {
      const [_result, l] = parse_packet(literal);

      result.push(_result);
      total_length_subpackets -= l;
    }
    return [result, orig + 1 + 15];
  }
};

const parse_packet = (binary_input) => {
  if (!binary_input.length) {
    return [null, 0];
  }
  const version = parseInt(binary_input.splice(0, 3).join(""), 2);
  const flag = parseInt(binary_input.splice(0, 3).join(""), 2);

  if (flag === LITERAL_VALUE) {
    const [result, l] = parse_literal(binary_input);
    return [result, l + 6];
  } else {
    let [result, l] = parse_operator(binary_input);
    result = result.filter((a) => a != null);

    if (flag === 0) {
      result = result
        .reduce((t, n) => from_binary_to_big_int(n) + t, BigInt(0))
        .toString(2);
    }
    if (flag === 1) {
      result = result
        .reduce((t, n) => from_binary_to_big_int(n) * t, BigInt(1))
        .toString(2);
    }
    if (flag === 2) {
      result = result
        .reduce(
          (min, n) =>
            from_binary_to_big_int(n) < min ? from_binary_to_big_int(n) : min,
          Infinity
        )
        .toString(2);
    }
    if (flag === 3) {
      result = result
        .reduce(
          (max, n) =>
            from_binary_to_big_int(n) > max ? from_binary_to_big_int(n) : max,
          -Infinity
        )
        .toString(2);
    }
    if (flag === 5) {
      result =
        from_binary_to_big_int(result[0]) > from_binary_to_big_int(result[1])
          ? "1"
          : "0";
    }
    if (flag === 6) {
      result =
        from_binary_to_big_int(result[0]) < from_binary_to_big_int(result[1])
          ? "1"
          : "0";
    }
    if (flag === 7) {
      result =
        from_binary_to_big_int(result[0]) == from_binary_to_big_int(result[1])
          ? "1"
          : "0";
    }

    return [result, l + 6];
  }
};

module.exports = (hex_input) => {
  const binary_input = from_hex_to_binary(hex_input);

  const [r] = parse_packet(binary_input);

  return from_binary_to_big_int(r);
};
