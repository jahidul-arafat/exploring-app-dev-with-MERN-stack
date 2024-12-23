import parseArgs from "minimist";
import Timer from "tiny-timer"

// execution
console.log('Starting app...');
const {mytime} = parseArgs(process.argv); // The parseArgs function is then used to parse the command-line arguments
// the public node package "minimalist" parge the commandline argument for us

// --time argument
// node index --time 100
if (!mytime) {
    throw new Error("---time is required");
}

// node <index> --time test
if (!parseInt(mytime)) {
    throw new Error("---time must be a number");
}

console.log(mytime);

// pipe the mytime to tiny-timer
const tinyTimer = new Timer();

// Event handler for tiny-timer state changes {start, change,stop}
tinyTimer.on("tick", (ms) => {
    console.log("tick", ms)
});

tinyTimer.on("done", () => {
    console.log("the ticking ic completed!!")
});

tinyTimer.on("statusChanged", (status) => {
    console.log(`Status: ${status}`);
});

// start the time; pipe "mytimer" to tiny-timer
tinyTimer.start(mytime * 1000); // runt the timer for 5000ms