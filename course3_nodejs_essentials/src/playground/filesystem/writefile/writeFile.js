// Write the content to a file
const fsModule = require("fs"); // import the filesystem module

// create some markdown that will eb saved to a file
let contentsToWrite = `
    This is a New File
    ======================
    
    ES6 Template String are cool. They honor whitespace.
    
    * Template Strings
    * Node File System
    * Readline CLIs
`;

const fileName = "./writeme.md";
// Asynchronous writing, non-blocking
fsModule.writeFile(fileName, contentsToWrite.trim(), (err) => {
    if (err) throw err;
    fsModule.appendFileSync(fileName,"\n\n #### New Line Appended"); // appending synchronously, blocking
    console.log("File Writing Done");
});
