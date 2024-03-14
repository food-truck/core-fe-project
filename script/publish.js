/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const childProcess = require("child_process");
const fs = require("fs-extra");

function spawn(command, args, errorMessage, options) {
    const isWindows = process.platform === "win32"; // spawn with {shell: true} can solve .cmd resolving, but prettier doesn't run correctly on mac/linux
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, args, {stdio: "inherit", ...options});
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(errorMessage);
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${args.join(" ")}`);
        process.exit(1);
    }
}

function publish() {
    console.info("distribute ...");
    fs.mkdirsSync("build/dist/lib");
    fs.mkdirsSync("build/dist/lib");
    fs.copySync("lib", "build/dist/lib/", {dereference: true});
    fs.copySync("package.json", "build/dist/package.json", {dereference: true});
    fs.copySync("README.md", "build/dist/README.md", {dereference: true});
    fs.copySync("src", "build/dist/src", {dereference: true});
    fs.copySync("./.npmrc", "build/dist/.npmrc", {dereference: true});
    return spawn("npm", ["publish", "--registry=https://pkgs.dev.azure.com/foodtruckinc/Wonder/_packaging/npm-local/npm/registry/"], "publish failed, please fix");
}

publish();
