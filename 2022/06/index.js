function* chunks(input, chunkSize) {
  for (let ix = 0; ix < input.length; ix++) {
    yield [input.substring(ix, ix + chunkSize), ix];
  }
}

function findStartMarker(input, packetLength) {
  const it = chunks(input, packetLength);
  do {
    const { value, done } = it.next();
    if (done) {
      break;
    }
    const [seq, ix] = value;

    if (seq.length === packetLength && new Set(seq).size === packetLength) {
      return ix + packetLength;
    }
  } while (true);
}

module.exports.part1 = (input) => {
  return findStartMarker(input, 4);
};

module.exports.part2 = (input) => {
  return findStartMarker(input, 14);
};
