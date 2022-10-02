const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs/promises");
const fsExtra = require("fs-extra");

async function main() {
  const buildDir = path.join(__dirname, "../build");

  await fs.mkdir(buildDir, { recursive: true });

  fsExtra.emptyDirSync(buildDir);
  fsExtra.removeSync(path.join(__dirname, "../app.asar"));

  await fsExtra.copy(
    path.join(__dirname, "../package.json"),
    path.join(buildDir, "package.json")
  );

  await fsExtra.copy(
    path.join(__dirname, "../src"),
    path.join(buildDir, "src")
  );

  await fsExtra.copy(
    path.join(__dirname, "../shared"),
    path.join(buildDir, "shared")
  );

  await fsExtra.copy(
    path.join(__dirname, "../scripts"),
    path.join(buildDir, "scripts")
  );

  execSync("npm i", {
    cwd: path.join(__dirname, "../webapp"),
  });

  execSync("npm run build", {
    cwd: path.join(__dirname, "../webapp"),
  });

  await fsExtra.move(
    path.join(__dirname, "../webapp/dist"),
    path.join(buildDir, "webapp")
  );

  await fsExtra.copy(
    path.join(__dirname, "../electron/index.js"),
    path.join(buildDir, "electron/index.js")
  );

  await fsExtra.copy(
    path.join(__dirname, "../electron/preload.js"),
    path.join(buildDir, "electron/preload.js")
  );

  await fsExtra.copy(
    path.join(__dirname, "../electron/favicon.ico"),
    path.join(buildDir, "electron/favicon.ico")
  );

  await fsExtra.copy(
    path.join(__dirname, "../electron/scripts"),
    path.join(buildDir, "electron/scripts")
  );

  execSync("npm i", {
    cwd: path.join(__dirname, "../electron/render"),
  });

  execSync("npm run build", {
    cwd: path.join(__dirname, "../electron/render"),
  });

  await fsExtra.move(
    path.join(__dirname, "../electron/render/dist"),
    path.join(buildDir, "electron/render")
  );

  execSync("npm i --production", { cwd: buildDir });
}

main();
