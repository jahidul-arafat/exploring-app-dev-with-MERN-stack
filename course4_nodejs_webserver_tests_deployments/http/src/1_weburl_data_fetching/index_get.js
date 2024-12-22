// fetch data from a website
// import modules
const {get} = require("https"); // import https module // destructuring
const {createWriteStream} = require("fs"); // import filesystem module // destructuring
const {createInterface} = require("readline"); // for user input to choose the chunk to see its contents

// Define the properties
const url = "https://en.wikipedia.org/wiki/Cher";
let chunkCount = 0;
let bytesToDisplay = 100; // let's display the 100 bytes of any selected chunk
const toSaveFileName = "./response.html";
let chunkList = [];

const readlineInterfaceWrapper = createInterface({
    input: process.stdin,
    output: process.stdout
});

// Reading the data chunks in stream from the URL
// Make the https request using https.get() method
const clientRequestToGetDataChunk = get(url, (res) => {
    let downloadWriteStream = createWriteStream(toSaveFileName); // create a writable stream to save the downloaded file
    console.log("Response Started");

    res.pipe(downloadWriteStream); // pipe the response to the downloadWriteStream

    res.on("data", chunk => { // when data chunk is received from the weburl, print its length and increment the chunkCount and push the chunk into chunkList
        console.log(`----Chunk[${chunkCount}]: ${chunk.length} bytes`);
        chunkCount++;
        chunkList.push(chunk.toString('utf8')); // chunks are pushed into Array as raw buffers, not as characters
    });

    // add an event listener for when the response ends
    res.on("end", () => { // when the response ends, print the total number of chunks received and ask user to choose a chunk to view its contents
        console.log("Response finished");
        console.log(`File Downloaded and Saved as ${toSaveFileName}`);
        console.log(`Total chunks received: ${chunkCount}`);

        // Ask user to choose a chunk to view its contents
        askUserForChunk(); // recursive call; will only end when 'q' in typed
    });
});

// Error handling for the request
// handle any errors that occur during the request
clientRequestToGetDataChunk.on("error", (err) => {
    console.error("Error Triggered: ", err);
    process.exit(1);
});

// Utility Functions
// Utility Function 01: Function to validate chunk index
function isValidChunkIndex(chunkIndex) {
    if (isNaN(chunkIndex) || chunkIndex < 0 || chunkIndex >= chunkCount) {
        console.log(`Invalid Chunk Number: ${chunkIndex}; Please try again.`);
        return false;
    }
    return true; //valid chunk index
}

// Utility Function 02: Display chunk contents
function displayChunkContents(chunkIndex, byteCount) {
    const selectedChunk = chunkList[chunkIndex];
    console.log(`Contents of chunk ${chunkIndex} (up to ${byteCount} bytes): `);
    console.log(selectedChunk.toString('utf8').slice(0, byteCount));
    console.log(".....");
}

// Main Function to ask user for chunk selection
function askUserForChunk() {
    const formattedQuestion = `Enter a chunk number (0-${chunkCount - 1}) to view its contents, or 'q' to quit: > `;
    readlineInterfaceWrapper.question(formattedQuestion, (answer) => {
        if (answer.toLowerCase() === "q") {
            readlineInterfaceWrapper.close();
            return;
        }

        const chunkIndex = parseInt(answer);

        if (!isValidChunkIndex(chunkIndex)) {
            askUserForChunk();
            return;
        }

        displayChunkContents(chunkIndex, bytesToDisplay);
        askUserForChunk();
    });
}

// Event Trigger
process.on("exit", () => {
    console.log("Exiting ...");
});

readlineInterfaceWrapper.on("close", () => {
    console.log("Closing the RL wrapper");
    process.exit(0);
});