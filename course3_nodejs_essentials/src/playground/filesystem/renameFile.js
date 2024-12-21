// rename a file with renameSync() function
const fsModule=require("fs");

currentFileName="./config.js";
newFileName="./project-config.js";

// check if the file exists
if (!fsModule.existsSync(currentFileName)){
    console.log("The file does not exist");
    process.exit();
}
// rename the file synchronously, blocking the rest of the process until the file is renamed
fsModule.renameSync(currentFileName,newFileName); // synchronous, blocking

console.log(`${currentFileName} renamed to ${newFileName}`);

// move the file to correct directory o
fsModule.rename("./notes.md","./NewDir/notes.md",(err)=>{
    if (err) console.log(err);
    console.log("File Renaming Successful");
})

// files can be removed using fs.unlinkSync() function
// fsModule.unlinkSync("./NewDir/notes.md"); // synchronously remove the file, blocking

fileToRemove="./NewDir/notes.md";
if(!fsModule.existsSync(fileToRemove)){
    console.log("File doesnt exists ... cant remove");
    process.exit(1);
}

// asynchronously remove a file, non-blocking
fsModule.unlink("./NewDir/notes.md",(err)=>{
    if (err) console.log(err);
    console.log("File Removes Successfully/ [Asynchronously]...")
})

console.log("Removing File ....");