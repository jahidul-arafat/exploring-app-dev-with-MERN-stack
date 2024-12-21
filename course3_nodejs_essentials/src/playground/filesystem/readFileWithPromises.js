// import modules
const fsPromises = require("fs").promises; // to deal with async operations like file I/O;
// also, promises help to avoid the deeply nested callback hell
const fsModule = require('fs');
const readlineModule = require("readline"); // for user input from terminal

//Example-01: Reading file contents using fsPromises
// const fsPromises = require('fs').promises;
async function readFileFsPromises(path) {
    try {
        const data = await fsPromises.readFile(path, 'utf8');
        console.log(data);
        console.log("File Processing Completed")
    } catch (error) {
        console.error('Error reading file:', error);
    }
}


/*
Example-02: Reading file content with explicit promises and directly returning the Promise Chain
when the processFileRead() function doesnt need to be async. But that doesnt mean processFileRead() becomes synchronous and blocking;
Both the async/await and returning a Promise chain are syntactically similar-> results in async, non-blocking behavior.
 */

function readFileWithPromisesChain(path) {
    return new Promise((resolve, reject) => {
        fsModule.readFile(path, 'UTF-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function processFileReadWithPromisesChain(path) {
    // if this syntax used, then the processFileRead() will no longer be async; it will return the Promise chain directly
    return readFileWithPromisesChain(path)
        .then(data => {
            console.log("File Contents: ", data);
            console.log("File Processing completed.");
        }).catch(err => {
            console.error("Error reading File: ", path, err);
        });
}

// Usage
// Since promise chain are returned directly, its the responsibility of the called to handle the asynchronous operation's result or error when it completes.
// processFileReadWithPromisesChain("./readme.md")
//     .then(() =>{
//         console.log("File processing completed.")
//     }).catch(err=>{
//         console.log("An error occurred during file processing: ",err);
// });

// Example-03: Reading file contents using async/await and try...catch
// Promise chain is not returned explicitly
//fsPromise (implicit promise) is not used, instead explicit promise used
function readFileWithPromises(path) {
    return new Promise((resolve, reject) => {
        fsModule.readFile(path, 'UTF-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function processFileReadWithPromises(path) {
    try {
        const data = await readFileWithPromises(path);
        console.log(data);
        console.log("File Processing completed");
    } catch (err) {
        console.error("Error reading File: ", path);
    }
}

// Usage
// Since promise chain are returned directly, its the responsibility of the called to handle the asynchronous operation's result or error when it completes.
// processFileRead("./readme.md").then(()=>{
//     console.log("File Processing completed");
// });

// console.log("Reading File Contents")

// user input handling
// Create a readlineInterfaceWrapper on the readlineModule for the input and output
// Why this wrapper?
// when readlineModule.question() is used, the interfaceWrapper will 'implicitly' use the
// -- output(stdout) to display the question to the user
// -- input(stdin) to wait for and read the user's answer
const readlineInterfaceWrapper = readlineModule.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser() {
    const formattedQuestion = `Choose an option \n
    1. Read with fsPromise\n
    2. Read with Promise Chain \n
    3. Read with Promise \n
    4. 'q' to exit
    
    Enter Option: >>> 
    `
    const filePath = "./readme.md";

    // check if the file exits or not
    if (!fsModule.existsSync(filePath)) {
        console.log(`File ${filePath} not found ...exiting....`);
        process.exit(1);
    }

    readlineInterfaceWrapper.question(formattedQuestion, (answer) => {
        switch (answer) {
            case '1':
                readFileFsPromises(filePath).then(() => askAgain()).catch((err)=>{
                    console.log(`Error processing the file ${filePath}`);
                });
                break;
            case '2':
                processFileReadWithPromisesChain(filePath).then(() => askAgain()).catch((err)=> {
                    console.log(`Error processing the file ${filePath}`);
                });
                break;
            case '3':
                processFileReadWithPromises(filePath).then(() => askAgain()).catch((err)=>{
                    console.log(`Error processing the file ${filePath}`);
                });
                break;
            case 'q':
                console.log("Exiting....");
                readlineInterfaceWrapper.close();
                break;
            default:
                console.log("Invalid option. Please choose 1,2,3 or 'q' to quit.");
                askAgain();

        }
    })
}

function askAgain(){
    console.log("\n");
    promptUser(); // call promptUser() again to ask for the next input
}

// start the prompt loop
console.log("File Reading Options");
promptUser();

// handle the 'close' event
readlineInterfaceWrapper.on("close",()=>{
    console.log("Thanks for using the file reader. GoodBye!!!");
    process.exit(0);
})

process.on("exit",()=>{
    console.log("Exiting.....");
})