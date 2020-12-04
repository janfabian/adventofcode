const { debug } = require("../../lib/utils");

const requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
// eslint-disable-next-line no-unused-vars
const optionalFields = ["cid"];
const validation = {
  byr: (v) => /^\d{4}$/.test(v) && parseInt(v) >= 1920 && parseInt(v) <= 2002,
  iyr: (v) => /^\d{4}$/.test(v) && parseInt(v) >= 2010 && parseInt(v) <= 2020,
  eyr: (v) => /^\d{4}$/.test(v) && parseInt(v) >= 2020 && parseInt(v) <= 2030,
  hgt: (v) => {
    if (/^(\d{3}cm|\d{2}in)$/.test(v)) {
      const [, , cm, inch] = v.match(/^((\d{3})cm|(\d{2})in)$/);
      if (cm) {
        return parseInt(cm) >= 150 && parseInt(cm) <= 193;
      }
      if (inch) {
        return parseInt(inch) >= 59 && parseInt(inch) <= 76;
      }
    }
    return false;
  },
  hcl: (v) => /^#[0-9a-f]{6}$/.test(v),
  ecl: (v) => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(v),
  pid: (v) => /^\d{9}$/.test(v),
};

module.exports = (input) => {
  const result = input
    .split("\n\n")
    .map((record) => record.replace(/\n+/g, " ").split(" "))
    .map((keyValues) => keyValues.map((line) => line.split(":")))
    .map((keys) => {
      debug(keys);
      return keys;
    })
    .map(
      (keyValues) =>
        requiredFields.reduce(
          (res, reqKey) =>
            res && keyValues.map(([key]) => key).includes(reqKey),
          true
        ) &&
        keyValues.reduce((res, [key, value]) => {
          let validationResult = true;
          if (validation[key]) {
            debug(`validating key: ${key}, value: ${value}`);
            validationResult = validation[key](value);
            debug(`result ${validationResult}`);
          }
          return validationResult && res;
        }, true)
    )
    .filter(Boolean).length;

  return result;
};
