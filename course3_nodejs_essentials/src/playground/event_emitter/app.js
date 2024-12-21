// EventEmitter to allow Pib-Sub architecture to ensure asynchrony
const {EventEmitter}= require("events").EventEmitter; // import the event module

// create a new emitter using the eventModule
let emitter= new EventEmitter();

// create a custom event that will be triggered when the emitter is on
emitter.on("customEvent",(message,user)=>{
    console.log(`${user}: ${message}`);
});

// Now emit this event
emitter.emit("customEvent", "Hello Emitter", "uAllay");
emitter.emit("customEvent", "That's Cool", "uBilly");

function promptUser(){
    process.stdout.write(`\n Enter Data: > `);
}

// initialize the prompt
promptUser();

// Handle user input
// now if a "data" event occurs, i.e. user write something in terminal, then the emitter will emit
process.stdin.on("data",(inputData)=>{
    const input=inputData.toString().trim();
    // if user typed "exit"
    if (input.toLowerCase()==="exit"){
        emitter.emit("customEvent","GoodBye","uProcess");
        process.exit();
    }

    // if user typed anything other than "exit"
    emitter.emit(
        "customEvent",
        input,
        "uTerminal"
    );

    // Prompt for next input
    promptUser();
});

process.on("exit", ()=>{
    console.log("Process Exiting...")
})
