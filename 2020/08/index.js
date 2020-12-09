const parse = (call) => {
  const [, fnName, attr] = call.match(/([a-z]+) ((-|\+)\d+)/);
  return [fnName, parseInt(attr)];
};

const NOP = "nop";
const ACC = "acc";
const JMP = "jmp";

const functions = {
  [NOP]: (line, result) => [line + 1, result],
  [ACC]: (line, result, a) => [line + 1, result + a],
  [JMP]: (line, result, to) => [line + to, result],
};

const programRun = (program) => {
  let line = 0;
  let result = 0;
  let next = program[line];
  const processedLines = new Set();

  while (next) {
    const [fnName, attr] = next;
    const [nextLine, fnResult] = functions[fnName](line, result, attr);
    result = fnResult;
    processedLines.add(line);
    if (!processedLines.has(nextLine)) {
      next = program[nextLine];
      line = nextLine;
    } else {
      next = null;
    }
  }

  return [result, line];
};

module.exports.run = (input) => {
  const program = input.trimEnd().split("\n").map(parse);

  return programRun(program)[0];
};

module.exports.repairAndRun = (input) => {
  const variants = input
    .trimEnd()
    .split("\n")
    .map(parse)
    .map(([fnName], ix, program) => {
      if (fnName === ACC) {
        return;
      }
      const variant = program.map((instruction) => [...instruction]);
      if (fnName === NOP) {
        variant[ix][0] = JMP;
      }
      if (fnName === JMP) {
        variant[ix][0] = NOP;
      }
      return variant;
    })
    .filter(Boolean);

  const programLength = variants[0].length;

  return variants
    .map(programRun)
    .find(([, lastLine]) => lastLine === programLength)[0];
};
