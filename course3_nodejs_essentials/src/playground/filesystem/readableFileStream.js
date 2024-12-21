/*
Key Points
============
- process.stdin: Represents the standard input stream, allowing you to read data from the terminal.
- process.stdout: Represents the standard output stream, allowing you to write data to the terminal.
- process.exit(): Exits the Node.js process
*/
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
    process.stdout.write(`\n\n ${questions[i]}`);
    process.stdout.write(` > `);
}

// ask the first question
ask();

process.stdin.on("data", (input) => {
    const userInput = input.toString().trim();
    if(!(userInput==="exit")) answers.push(userInput); // don't push the "exit" user input
    if (answers.length < questions.length && !(userInput.toLowerCase() === "exit")) {
        ask(answers.length);
    } else {
        process.exit(); // calling the process.on()
    }
});

process.on("exit",()=>{
    process.stdout.write(`Use Answers: ${answers}`)
    process.stdout.write("\n\n You are existing the answers....")
});





