// create a directory and console log if directory already exists
const fsModule = require("fs");

dirNameToCreate = "./NewDir";

// check if directory already exists
if (fsModule.existsSync(dirNameToCreate)) {
    console.log("Directory already exists");
    process.exit();
}

// create the directory asynchronously
fsModule.mkdir(dirNameToCreate, (err) => {
    if (err) throw err;
    console.log(`Directory ${dirNameToCreate} is created`);
});