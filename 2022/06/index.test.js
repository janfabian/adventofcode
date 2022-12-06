const fn = require("./index");

test.each([
  ["mjqjpqmgbljsphdztnvjfqwrcgsmlb", 7],
  ["bvwbjplbgvbhsrlpgdmjqwftvncz", 5],
  ["nppdvjthqldpwncqszvftbrmjlhg", 6],
  ["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 10],
  ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 11],
])("examples part1", (input, expected) => {
  expect(fn.part1(input)).toStrictEqual(expected);
});

test.each([
  ["mjqjpqmgbljsphdztnvjfqwrcgsmlb", 19],
  ["bvwbjplbgvbhsrlpgdmjqwftvncz", 23],
  ["nppdvjthqldpwncqszvftbrmjlhg", 23],
  ["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 29],
  ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 26],
])("examples part2", (input, expected) => {
  expect(fn.part2(input)).toStrictEqual(expected);
});
