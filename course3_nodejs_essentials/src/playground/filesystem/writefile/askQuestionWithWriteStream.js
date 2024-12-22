/*
Key Points
============
- process.stdin: Represents the standard input stream, allowing you to read data from the terminal.
- process.stdout: Represents the standard output stream, allowing you to write data to the terminal.
- process.exit(): Exits the Node.js process
 */

// WritableStream to write the data chunks that are being read by the readableStream
// Example-1: Workign with nodejs asynchronously using event driven design with 'process' object

// import modules
const fsModule = require("fs");

// create an answer stream - we will not use it until our user answer the first question
let answerStream;

// create an array of question
let questionList = [
    "Whats your name",
    "question 2",
    "question 3",
    "question 4",
];

let answerList = []; // an array to store the answers of the questions

function ask(i = 0) {
    process.stdout.write(`\n\n ${questionList[i]}`);
    process.stdout.write(` > `);
}

/*
- Use process.stdin.once for a one-time action like capturing a single user input or reacting to an event just once.
- Use process.stdin.on for ongoing actions like handling streams of data or repeated user inputs.
 */
// create a listen that will listen for the first user input and will never be used after than
process.stdin.once("data", (input) => {
    // when the user enter the first answer, we gonna create a name.md file to store all the questions and answers subsequently
    let name = input.toString().trim();

    // create the fileName based on the user input name
    let fileName = `./${name}.md`;

    // check if the file already exists; if so, delete the file and recreate
    if (fsModule.existsSync(fileName)) {
        console.log(`File ${fileName} existing..... Deleting to recreate`);
        fsModule.unlinkSync(fileName);
    }

    // now create the writeStream with the filename; where chunk of the data will be written prorgessively when avaiable
    answerStream = fsModule.createWriteStream(fileName); // this will stream any new data chunk to the name.md file
    answerStream.write(`Question Answers for ${name}\n====================\n\n`);
})

// will be always running for every user input
process.stdin.on("data", (input) => {
    const answer = input.toString().trim();
    // write the question and answer to the answerStream, which will write both in name.md file
    answerStream.write(`Question:${questionList[answerList.length]}\n`);
    answerStream.write(`Answer: ${answer} \n\n`, ()=>{
        if (answerList.length < questionList.length && !(answer.toLowerCase() === "exit")) {
            ask(answerList.length);
        } else {
            process.exit(); // calling the process.on()
        }
    });
    answerList.push(answer);
});

// event driven - only when an 'exit' event
// on process.exit()- call another function aka callback function
process.on("exit", () => {
    answerStream.close(); // when the process exit, close the write stream
    process.stdout.write(`\n\n You are exiting the QA section !!XX\nAll Answers: ${answerList}`)
});

// Usage
ask();





