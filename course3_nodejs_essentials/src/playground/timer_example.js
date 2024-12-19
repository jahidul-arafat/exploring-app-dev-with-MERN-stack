// Example-02: async operations with timeout function
const waitTime = 3000;
console.log(`setting a ${waitTime / 1000} second delay`);
const timerFinished = () => {
    clearInterval(interval);
    console.log("done");
};

setTimeout(timerFinished, waitTime); // wait for 3sec, and then trigger the timerFinished()

const waitInterval = 500; // every 1/2 a second
let currentTime = 0;
const incTime = () => {
    currentTime += waitInterval;
    const progress=Math.floor((currentTime/waitTime)*100);
    // process.stdout.clearLine();
    // process.stdout.cursorTo(0);
    process.stdout.write(`waiting ...${progress}% done\n`);
    console.log(`waiting ${currentTime / 1000} seconds`)
}

const interval=setInterval(incTime, waitInterval); // every 1/2 a second, call the function incTime()