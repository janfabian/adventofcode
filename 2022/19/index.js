const { inspect } = require("util");

function parseBlueprint(line) {
  const robots = line
    .split(" Each ")
    .slice(1)
    .map((r) => r.slice(0, -1).split(" robot costs "))
    .map(([material, resources]) => [material, resources.split(" and ")])
    .map(([material, resources]) => [
      material,
      resources
        .map((r) => r.split(" "))
        .map(([n, material]) => [parseInt(n), material]),
    ]);

  return robots;
}

module.exports.part1 = (input) => {
  const blueprints = input.split("\n").map(parseBlueprint);

  const n = 10;
  for (const blueprint of blueprints.slice(0, 1)) {
    const configurations = [
      {
        robots: { ore: 1 },
        materials: {},
      },
    ];

    for (let m = 1; m <= n; m++) {
      const configurations_length = configurations.length;
      console.log({ configurations_length });

      for (let ix = 0; ix < configurations_length; ix++) {
        const { robots: start_robots, materials: start_materials } =
          configurations[ix];
        const end_robots = { ...start_robots };
        const end_materials = { ...start_materials };

        for (const [material, n] of Object.entries(end_robots)) {
          end_materials[material] ||= 0;
          end_materials[material] += n;
        }

        for (const [material, required] of blueprint) {
          let new_robot;

          if (required.every(([rn, rmat]) => start_materials[rmat] >= rn)) {
            required.forEach(([rn, rmat]) => {
              end_materials[rmat] -= rn;
            });
            new_robot = material;
          }

          if (new_robot) {
            end_robots[new_robot] ||= 0;
            end_robots[new_robot]++;
          }

          configurations.push({ robots: end_robots, materials: end_materials });
        }

        // console.log(m, end_materials, end_robots);
      }
    }
    console.log(configurations);
  }
};
