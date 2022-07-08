const fs = require('fs-extra');

const sourceDir = "../atbash/deployments"; // set this to where your atbash contract project resides
const destDir = "./src/deployments";

if (!fs.pathExists(destDir)) {
    fs.mkdir("./src/deployments", (err) => {
        if (err) { 
            console.error(err);
            throw "import failed";
        }
    });
}

fs.copy(sourceDir, destDir, {overwrite: true }, (err) => {
    if (err) return console.error(err);
});

console.log("All deployments imported");

