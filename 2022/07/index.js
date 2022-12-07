const dirs = {};

function joinDirs(dir1, dir2) {
  if (dir1.endsWith("/")) {
    return dir1 + dir2;
  }
  if (dir2.startsWith("/")) {
    return dir1 + dir2;
  }

  return dir1 + "/" + dir2;
}

function pwd(dir) {
  if (!dir) {
    return "";
  }

  let result = joinDirs(dir.parentDir, dir.name);

  return result;
}

function changeDir(directory, parentDir) {
  if (directory === "..") {
    return dirs[parentDir.parentDir];
  }

  const parentPath = pwd(parentDir);
  const path = joinDirs(parentPath, directory);

  if (dirs[path]) {
    return dirs[path];
  }

  const dir = {
    name: directory,
    parentDir: parentPath,
    children: { files: [], folders: [] },
  };

  dirs[path] = dir;

  return dir;
}

function listDir(directory, output) {
  directory.children.files = output
    .filter((l) => !l.startsWith("dir "))
    .map((l) => l.split(" "))
    .map(([s, name]) => [BigInt(s), name]);
  directory.children.folders = output
    .filter((l) => l.startsWith("dir "))
    .map((l) => l.slice(4));
}

function parseCommand(cmd, activeDir, output) {
  let newActiveDir = activeDir;
  const [command, attr] = cmd.split(" ");

  switch (command) {
    case "cd": {
      newActiveDir = changeDir(attr, activeDir);
      break;
    }
    case "ls": {
      listDir(activeDir, output);
      break;
    }
    default:
      throw new Error("unknown command: " + cmd);
  }

  return newActiveDir;
}

function calculateSize(dir, a) {
  if (dir.size) {
    return dir.size;
  }

  const size =
    (dir.children.files.reduce((acc, [size]) => acc + size, 0n) || 0n) +
    (dir.children.folders.reduce(
      (acc, childDir) =>
        acc +
        calculateSize(
          dirs[joinDirs(joinDirs(dir.parentDir, dir.name), childDir)]
        ),
      0n
    ) || 0n);

  dir.size = size;

  return size;
}

function parseInput(input) {
  const [commands, outputs] = input.split("\n").reduce(
    ([grpdInput, output, lastCommandIx], line) => {
      if (line[0] === "$") {
        grpdInput.push(line.slice(2));
        return [grpdInput, output, lastCommandIx + 1];
      } else {
        output[lastCommandIx] ||= [];
        output[lastCommandIx].push(line);
        return [grpdInput, output, lastCommandIx];
      }
    },
    [[], [], -1]
  );

  return [commands, outputs];
}

module.exports.part1 = (input) => {
  const [commands, outputs] = parseInput(input);

  let activeDir;
  for (let ix = 0; ix < commands.length; ix++) {
    activeDir = parseCommand(commands[ix], activeDir, outputs[ix]);
  }

  for (const dir of Object.values(dirs)) {
    calculateSize(dir);
  }

  return Object.values(dirs)
    .map((d) => d.size || 0n)
    .filter((n) => n < 100000n)
    .reduce((acc, n) => acc + n, 0n);
};

module.exports.part2 = (input) => {
  const [commands, outputs] = parseInput(input);

  let activeDir;
  for (let ix = 0; ix < commands.length; ix++) {
    activeDir = parseCommand(commands[ix], activeDir, outputs[ix]);
  }

  for (const dir of Object.values(dirs)) {
    calculateSize(dir);
  }

  const free = 70000000n - dirs["/"].size;
  const required = 30000000n - free;

  return Object.values(dirs)
    .map((d) => d.size || 0n)
    .sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    })
    .find((s) => s > required);
};
