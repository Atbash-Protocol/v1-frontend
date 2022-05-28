const fs = require('fs-extra');

const sourceDir = "../atbash/deployments/localhost";
const destDir = "./src/deployments/localhost";

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

console.log("Localhost deployments imported");

