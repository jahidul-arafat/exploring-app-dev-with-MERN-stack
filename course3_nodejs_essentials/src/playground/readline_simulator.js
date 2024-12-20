// Readline module - to control user prompt
// its a wrapper around standard-input and standard-output process, without directly workign with stdin and stdout
const readlineModule = require("readline"); // import the readline module

// Now, we will crate an interface or wrapper for the process.stdin and process.stdout
const readlineInterfaceWrapper = readlineModule.createInterface({
    input: process.stdin,
    output: process.stdout
});

// list of questions
const questionList = [
    "question 01 ? ",
    "question 02 ? ",
    "question 03 ? "
];

async function collectAnswers(questionList, callBackWhenAllQuestionsAreAnswered) {
    const answerList = [];
    let currentQuestionIndex = 0;
    let totalQuestionCount = questionList.length;
    const questionAnswered = (answer) => {
        answerList.push(answer.trim());
        currentQuestionIndex++;
        // if (currentQuestionIndex === totalQuestionCount) {
        //     callbackDone(answerList);
        // }

        // if(currentQuestionIndex<totalQuestionCount){
        //     readlineInterfaceWrapper.question(
        //         questionList[answerList.length], // A question
        //         questionAnswered // a callback function // calling the function again with the new question till all the questions are answered
        //     )
        // } else{
        //     return callbackDone(answerList); // this is kinda exit function
        // }
    };

    const askQuestion = () => {
        // Note: readline.question() method is asynchronous and non-blocking
        return new Promise((resolve, reject) => {
            readlineInterfaceWrapper.question(questionList[currentQuestionIndex], (answer) => {
                questionAnswered(answer);
                resolve(); // resolve only when the user has answered the question
            });

        });

    };

    // The askQuestion function returns a Promise that resolves when the user has answered the current question.
    // This allows the do...while loop to wait for each question to be answered before proceeding to the next iteration.
    try{
        do {
            await askQuestion(); // This allows the do...while loop to wait for each question to be answered before proceeding to the next iteration.
        } while (currentQuestionIndex < totalQuestionCount);

        callBackWhenAllQuestionsAreAnswered(answerList); // when all the questions are answered, the callback function is called with the collected answers.
    } finally {
        readlineInterfaceWrapper.close(); // this will ensure the readline interface is always closed, even if an error occurs.
    }

}

// Execution

const callBackWhenAllQuestionsAreAnswered = (allAnswers) => {
    console.log("Thanks for answering all the questions...")
    console.log(allAnswers);
    //process.exit(); // call process.on on exit
}

collectAnswers(
    questionList,
    callBackWhenAllQuestionsAreAnswered)
    .then(() => {
        console.log("All questions have been answered.");
        process.exit();
    })
    .catch((error) => {
        console.error("An error occurred: ", error);
        process.exit(1); // exit with an error code
    })
;

process.on("exit", () => {
    console.log("Existing the process....")
});

// readlineInterfaceWrapper.question("How are you?", (answer) => {
//     console.log(`Your answer is ${answer}`);
// });