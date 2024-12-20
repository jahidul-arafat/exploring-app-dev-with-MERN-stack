// import all the required modules from ./lib/collectAnswers.js
const {collectAnswers, callBackWhenAllQuestionsAreAnswered} = require("./lib/collectAnswers")
const {EventEmitter} = require("events");
// list of questions
const questionList = [
    "question 01 ? ",
    "question 02 ? ",
    "question 03 ? "
];


async function runQuestions() {
    try {
        const emitter = new EventEmitter();
        // Setup event listeners on the emitter returned by collectAnswers()
        emitter.on("answer", (answer) => {
            console.log(`[event-Individual-Answer-Emitter] Answer: ${answer}`);
        });
        emitter.on("complete", (answerList) => {
            console.log(`[event-Complete Emitter]: All Answers ${answerList}`);
        });

        // Now start collecting answers
        // means, runQuestions() will wait for the collectAnswers() function to complete
        // that's why "await" keyword was added.
        await collectAnswers(
            questionList,
            (answerList) => {
                callBackWhenAllQuestionsAreAnswered(answerList)
            },
            emitter // Pass the emitter to the collectAnswers
        );

    } catch (error) {
        console.error("An error occurred: ", error);
        process.exit(1); // exit with an error code
    }
}

runQuestions().then(r => {
    console.log("Completed...")
});

process.on("exit", () => {
    console.log("Existing the process....")
});
