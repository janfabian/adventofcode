const processLine = (line) => line.split("").filter((s) => s !== " ");
const exp = (queue) => {
  let n, s, op;
  let result = BigInt(0);
  while ((s = queue.splice(0, 1)[0])) {
    switch (s) {
      case "(": {
        n = exp(queue);
        break;
      }
      case ")": {
        return result;
      }
      case "*": {
        op = (a, b) => a * b;
        break;
      }
      case "+": {
        op = (a, b) => a + b;
        break;
      }
      default: {
        n = BigInt(s);
      }
    }
    if (n) {
      if (op) {
        result = op(result, n);
        n = null;
        op = null;
      } else {
        result = n;
        n = null;
      }
    }
  }

  return result;
};

const numberRegexp = /^\d+$/;
const brackets = (expression, i) => {
  let rb = true;
  let c = 0;
  let j = i;
  while (rb) {
    j++;
    if (j === i + 1 && numberRegexp.test(expression[j])) {
      expression.splice(j + 1, 0, ")");
      rb = false;
      continue;
    }
    if (expression[j] === "(") {
      c++;
    } else if (expression[j] === ")") {
      c--;
      if (c === 0) {
        expression.splice(j + 1, 0, ")");
        rb = false;
        continue;
      }
    }
  }

  let lb = true;
  c = 0;
  j = i;
  while (lb) {
    j--;
    if (j === i - 1 && numberRegexp.test(expression[j])) {
      expression.splice(j, 0, "(");
      lb = false;
      continue;
    }
    if (expression[j] === ")") {
      c++;
    } else if (expression[j] === "(") {
      c--;
      if (c === 0) {
        expression.splice(j, 0, "(");
        lb = false;
        continue;
      }
    }
  }
};

module.exports.first = (input) => {
  const eqs = input.trimEnd().split("\n").map(processLine);

  return eqs.map(exp).reduce((s, r) => s + r, BigInt(0));
};

module.exports.second = (input) => {
  const eqs = input.trimEnd().split("\n").map(processLine);

  return eqs
    .map((e) => {
      let max = e.length;
      let i = 0;
      while (i < max) {
        if (e[i] === "+") {
          brackets(e, i);
          i++;
          max += 2;
        }
        i++;
      }

      return e;
    })
    .map(exp)
    .reduce((s, r) => s + r, BigInt(0));
};
