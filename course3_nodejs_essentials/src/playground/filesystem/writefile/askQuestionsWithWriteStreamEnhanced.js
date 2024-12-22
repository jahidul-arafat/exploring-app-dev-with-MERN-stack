// filesystem+promises+readline+eventemitter
// import modules
const fsPromise = require("fs").promises;
const {createWriteStream} = require("fs");
const readlineModule = require("readline");
const {EventEmitter} = require("events").EventEmitter;

// Define Variables
// EventEmitter for Question and Answer
const qaEmitter = new EventEmitter();

// List of questions to ask
const questionList = [
    "What's your name?",
    "What's your favorite color?",
    "What's your favorite food?",
    "What's your hobby?",
];

let answerList=[];
let answerStream;

// create readline interface wrapper for user input
const readlineInterfaceWrapper = readlineModule.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*
This function creates or recreates a write stream for saving answers:
- It checks if the file exists, deletes it if it does
- Creates a new write stream
- Writes an initial header to the file
 */

async function createAnswerWriteStream(writeStreamFileName) {
    const fileName = `./${writeStreamFileName}.md`;
    try {
        await fsPromise.access(fileName); // wait to access the file
        console.log(`File ${fileName} already exists. Deleting or recreating....`);
        await fsPromise.unlink(fileName); // deleting the file
    } catch (error) {
        // file doesnt exists
        console.log(`Creating new file: ${fileName}`);
    }
    // now create the writeStream with the filename; where chunk of the data will be written prorgessively when avaiable
    answerStream = createWriteStream(fileName); // this will stream any new data chunk to the name.md file
    answerStream.write(`Question Answers for ${fileName}\n====================\n\n`);
}

// This function asks a question and returns a promise that resolves with the user's answer.
async function ask(i = 0) {
    const formattedQuestion = `${questionList[i]} > `;
    return new Promise((resolve, reject) => {
        readlineInterfaceWrapper.question(formattedQuestion, (answer) => {
            resolve(answer.trim());
        });
    });
}

// This function processes an answer:
// Writes the question and answer to the stream
// Emits an "answerReceived" event
async function processAnswerAndSaveToStream(answer,index){
    console.log(`Processing Answer for Question ${index+1}....`);
    answerStream.write(`Question:${questionList[index]}\n`);
    answerStream.write(`Answer: ${answer} \n\n`);
    qaEmitter.emit("answerReceived",answer,index);
}

/*
This is the main function that runs the Q&A process:
- Asks for a filename (user's name)
- Creates the answer stream
- Loops through questions, asking and processing answers
- Handles early exit if user types "exit"
- Closes the stream and readline interface when done
 */
async function runQuestionAnswer() {
    console.log("Welcome to the Question-Answer Session!");
    console.log("---------------------------------------");

    try {
        const filename = await ask();
        await createAnswerWriteStream(filename);

        for(let i=1;i<questionList.length;i++){
            const answer=await ask(i);

            await processAnswerAndSaveToStream(answer,i);
            if (answer.toLowerCase()==="exit"){
                console.log("Exiting early as per user request....");
                break;
            }
            answerList.push(answer);
        }
        console.log("\n\nAll questions answered. Saving responses....")
    } catch (error) {
        console.log("Error occurred: ", error);

    } finally {
        if (answerStream) {
            // ensures the write stream is properly closed before the program exits.
            /*
            - answerStream.end() is called to close the write stream.
            - The end() method can take a callback function as an argument, which is called when the stream is fully closed.
            - By wrapping this in a new Promise, we convert the callback-based end() method into a Promise-based operation.

         3. Promise wrapping:
            - new Promise((resolve) => ...) creates a new Promise.
            - The Promise resolves when answerStream.end() completes its operation.
            - This allows us to use await to ensure the stream is fully closed before moving on.
         4. Asynchronous nature:
        - Writing to a file is an asynchronous operation.
        - Without this Promise, the program might continue executing or even exit before all data is written to the file.

             */
            await new Promise((resolve)=>answerStream.end(resolve));
        }
        readlineInterfaceWrapper.close();
    }

}

// Event Emitter
qaEmitter.on("answerReceived",(answer,index)=>{
    console.log(`Answer received for Question ${index+1}: ${answer}`);
})

readlineInterfaceWrapper.on("close",()=>{
    console.log('\nThank you for participating in the Question-Answer session!');
    console.log('Your answers have been saved. Goodbye!');
    console.log(`Answers: ${answerList}`);
    process.exit(0);

})

// runt eh main function
runQuestionAnswer().catch(err=>{
    console.error("Fatal Error occurred...",err);
    process.exit(1);
})