const fsModule=require("fs");
/*
- readFile() -- asynchronously read the file, non-blocking
- readFileSync() - synchronously read the file, blocking
 */

//let fileContents=fsModule.readFileSync("./readme.md","UTF-8"); // read the contents of the file synchronously, with test encoding format

fsModule.readFile("./readme.md","UTF-8",(err,fileContents)=>{
    if (err) throw err;
    console.log(fileContents);
})

console.log("Reading file contents...");