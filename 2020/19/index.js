const ruleLinePrefixRegexp = /^(\d+): /;
const constantRegexp = /^".*"$/;

const processRules = (rulesInput) => {
  const rules = {};
  rulesInput.split("\n").forEach((ruleLine, i) => {
    const n = ruleLine.match(ruleLinePrefixRegexp)[1];
    rules[n] = ruleLine
      .replace(ruleLinePrefixRegexp, "")
      .split("|")
      .map((ruleGroup) => ruleGroup.trim())
      .map((ruleGroup) => ruleGroup.split(" ").map((a) => a.trim()));
  });
  return rules;
};

const possible = (letter, possibleCombs, rules) => {
  const result = [];
  const toProcess = possibleCombs;
  let possible = false;
  while (toProcess.length > 0) {
    const processing = toProcess.splice(0, 1)[0];
    let i;
    for (i = 0; i < processing.length; i++) {
      const s = processing[i];
      if (constantRegexp.test(s)) {
        if (s.slice(1, -1) === letter) {
          result.push(processing.slice(1));
          possible = true;
        }
        break;
      }
      if (rules[s]) {
        rules[s].map((r) => {
          let p = [...processing];
          p.splice(i, 1, ...r);
          toProcess.push(p);
        });
        break;
      }
    }
  }

  return [possible, result];
};

module.exports.first = (input) => {
  const [rulesInput, textInput] = input.trimEnd().split("\n\n");

  const rules = processRules(rulesInput);
  const words = textInput.split("\n");

  let result = 0;
  for (const word of words) {
    let updatedCombs;
    let isPossible;
    let combs = [...rules["0"]];

    for (const letter of word) {
      const [_isPossible, _updatedCombs] = possible(letter, combs, rules);
      isPossible = _isPossible;
      updatedCombs = _updatedCombs;
      if (!isPossible) {
        break;
      }
      combs = updatedCombs;
    }
    if (isPossible && updatedCombs.find((a) => a.length === 0)) {
      result++;
    }
  }

  return result;
};
