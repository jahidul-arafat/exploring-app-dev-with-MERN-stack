/*
Key Points
============
- process.stdin: Represents the standard input stream, allowing you to read data from the terminal.
- process.stdout: Represents the standard output stream, allowing you to write data to the terminal.
- process.exit(): Exits the Node.js process
 */


// discuss more about the global objects
// process object - collect information from terminal
// node page --user Ally --greeting "Hello from Node"
//console.log(process.argv) // path to node where its running + path to file

// lets grab the value after the index
function grab(flag) {
    let indexAfterFlag = process.argv.indexOf(flag) + 1;
    return process.argv[indexAfterFlag];
}

let greeting = grab("--greeting");
let user = grab("--user");
console.log(`${greeting} ${user}`);

// features of process object
// standardInput, standardOutput -- allow us to communicate with the process while its running
process.stdout.write("Process Hello \n\n\n");


// Example-1: Workign with nodejs asynchronously using event driven design with 'process' object

// create an array of question
const questions = [
    "Whats your name",
    "question 2",
    "question 3",
    "question 4",
];

const answers = []; // an array
function ask(i = 0) {

    // Note. process.stdout.write() can be replace with console.log()
    // but process.stdout.write() is more performant than console.log()
    process.stdout.write(`\n\n ${questions[i]}`);
    process.stdout.write(` > `);
    // console.log(`\n\n ${questions[i]} >`);
}

// ask the first question
ask();

// event driven - only when a 'data' event
// let the user answer this question
// listen for a data event ,
// 'data' -> is the event name, not the variable name;
// input -> parameter name for the callback function which will be emitted when the data event is triggered
process.stdin.on("data", (input) => {
    // process.stdout.write(data.toString().trim());
    // need to stop the process when we are out of data
    const userInput = input.toString().trim();
    answers.push(userInput);
    if (answers.length < questions.length && !(userInput.toLowerCase() === "exit")) {
        ask(answers.length);
    } else {
        process.exit(); // calling the process.on()
    }

    // console.log(`You entered : ${userInput}`)
});

// event driven - only when an 'exit' event
// on process.exit()- call another function aka callback function
process.on("exit",()=>{
    process.stdout.write("\n\n You are existing the answers....")
});





