// Rename and Remove a directory
const fsModule = require("fs");

const dirToRemove = "./Project-NewDir";
// // check if directory already exists and the directory does not contain any files or subdirectories
// if(!fsModule.existsSync(dirToRemove) || fsModule.readdirSync(dirToRemove).length > 0){
//     console.log("Directory either doesn't exist or is not empty; cant remove");
//     process.exit(1);
// }
//
// // remove the directory asynchronously
// // if(!fsModule.existsSync(dirToRemove)){
// //     console.log("Directory Doesnt Exists");
// //     process.exit(1);
// // }
// // fsModule.renameSync("./NewDir","./Project-NewDir"); // synchronous and blocking
// // console.log("Directory Renamed");
//
// fsModule.rmdir(dirToRemove,(err)=>{
//     if (err) throw err;
//     console.log("Directory Removed");
// })


// inline non-parameter function
const removeDir=()=>{
    fsModule.rmdir(dirToRemove, (err) => {
            if (err) throw err;
            console.log("Directory Removed...");
        }
    );
}

// check if directory exists or not
if(!fsModule.existsSync(dirToRemove)){
    console.log("Directory doesnt exists...");
    process.exit(1);
}

if (fsModule.readdirSync(dirToRemove).length>0){
    console.log("File exits in the directory, need to backup before deleting the directory...");
    console.log("Backing up the files to a new Directory");
    fsModule.readdirSync(dirToRemove).forEach(file => {
        fsModule.renameSync(`${dirToRemove}/${file}`, `./backup/${file}`)
    });
    console.log("All files removed to ./backup");
    // let's remove the directory now
    removeDir();
}




