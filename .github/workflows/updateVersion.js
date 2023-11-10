const fsp = require("fs/promises");
const { exec } = require('child_process');
const path = require('path');
​
async function autoUpdateVersion() {
    // Read package.json
    const PKG_PATH = path.resolve(__dirname, "package.json");
    try {
        const data = await fsp.readFile(PKG_PATH, { encoding: "utf-8" });
        const pkg = JSON.parse(data);
​
        // Update Version
        const currentVersion = pkg.version;
        const versionParts = currentVersion.split('.');
        let [major, minor, patch] = versionParts.map(Number);
        patch++;
        const newVersion = `${major}.${minor}.${patch}`;
​
        pkg.version = newVersion;
​
        await fsp.writeFile(PKG_PATH, JSON.stringify(pkg, null, 2), { encoding: "utf-8" });
        // Execute Git command to submit updates
        const commitMessage = `[AutoUpdateVersion] update version for ${newVersion}`;
        exec(`git commit -am "${commitMessage}"`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error while executing Git command:', error);
            } else {
                console.log(`The version number of #package.json# has been updated to ${newVersion}`);
                console.log('Git committed successfully!');
            }
        });
​
    } catch (error) {
        console.error(error);
        throw error;
    }
}
​
autoUpdateVersion();