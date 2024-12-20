// this is a library file which will be imported by the app.js
// Based on a list of question, this collectAnswers() function will collect all the answers
const readlineModule = require("readline"); // import the readline module

// Adjustment-Enhancement
// Applying the EventEmitter
const {EventEmitter} = require("events"); // import the Event module

// Create a readlineInterfaceWrapper on the readlineModule for the input and output
// Why this wrapper?
// when readlineModule.question() is used, the interfaceWrapper will 'implicitly' use the
// -- output(stdout) to display the question to the user
// -- input(stdin) to wait for and read the user's answer
const readlineInterfaceWrapper = readlineModule.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function collectAnswers(questionListToAsk, callBackWhenAllQuestionsAreAnswered, eventEmitter) {
    const answerList = [];
    let currentQuestionIndex = 0;
    let totalQuestionCount = questionListToAsk.length;

    const answerTheQuestion = (answer) => {
        answerList.push(answer.trim());
        eventEmitter.emit("answer",answer.trim()); // trigger an event everytime user answered a question
                                                            // Call the Event listener "answer"
        currentQuestionIndex++;
    };

    const askQuestion = () => {
        // Note: readline.question() method is asynchronous and non-blocking
        return new Promise((resolve, reject) => {
            const formattedQuestion = `Q${currentQuestionIndex}. ${questionListToAsk[currentQuestionIndex]} > `;
            readlineInterfaceWrapper.question(formattedQuestion, (answer) => {
                answerTheQuestion(answer); // stdout - showing the // push the answer to Array and move to the next question
                resolve(); // waiting for the fullfillment of the promise
                // means, the user has answered the question
                // resolve only when the user has answered the question
            });

        });
    }; // askQuestion

    // The askQuestion function returns a Promise that resolves when the user has answered the current question.
    // This allows the do...while loop to wait for each question to be answered before proceeding to the next iteration.
    try {
        do {
            await askQuestion(); // This allows the do...while loop to wait for each question to be answered before proceeding to the next iteration.
        } while (currentQuestionIndex < totalQuestionCount);

        callBackWhenAllQuestionsAreAnswered(answerList); // when all the questions are answered, the callback function is called with the collected answers.
        eventEmitter.emit("complete", answerList); // emit this event when all the questions are answered
    } finally {
        readlineInterfaceWrapper.close(); // this will ensure the readline interface is always closed, even if an error occurs.
    }

    return eventEmitter; // returns two events: "answer"--> event when an individual question is answered
                                                // "complete" --> event when all the questions are answered
} // collectAnswers()

const callBackWhenAllQuestionsAreAnswered = (allAnswers) => {
    console.log("Thanks for answering all the questions...")
    console.log(allAnswers);
    //process.exit(); // call process.on on exit
}



// let's export this collectAnswer() function, which will be consumed by App.js for final simulation
module.exports = {
    collectAnswers,
    callBackWhenAllQuestionsAreAnswered
};