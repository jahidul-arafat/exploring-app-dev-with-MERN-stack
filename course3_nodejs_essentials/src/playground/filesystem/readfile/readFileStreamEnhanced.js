// import required modules
const fsPromise = require("fs").promises; // for file I/O operation; async+non-blocking // implicit promises
const {createReadStream} = require("fs"); // to create a read stream of the input large file
const readlineModule = require("readline"); // for user input from terminal
const {EventEmitter} = require("events").EventEmitter;

// define properties
const fileToRead = "./chat-logs/sample.log";


// user input handling
const readlineInterfaceWrapper = readlineModule.createInterface({
    input: process.stdin,
    output: process.stdout
});


let overallData = "";
let chunkCount = 0;
const chunks = [];
const fileEmitter = new EventEmitter();

// Functions
// Dynamically determine the chunk size
async function determineChunkSize(fileToRead) {
    try {
        const fileStats = await fsPromise.stat(fileToRead); // async+ non-blocking
        const fileSizeInBytes = fileStats.size;

        // Example logic:
        // For files smaller than 1MB, use 100 byte chunks
        // For files between 1MB and 10MB, use 1KB chunks
        // For files between 10MB and 100MB, use 10KB chunks
        // For files larger than 100MB, use 100KB chunks

        if (fileSizeInBytes < 1024 * 1024) {
            return 100;
        } else if (fileSizeInBytes < 10 * 1024 * 1024) {
            return 1024;
        } else if (fileSizeInBytes < 100 * 1024 * 1024) {
            return 10 * 1024;
        } else {
            return 100 * 1024;
        }
    } catch (error) {
        console.error("Error determining chunk size:", error);
        return 100; // Default to 100 bytes if there's an error
    }
}

// Read the file contents; since the file size is large
// not reading the entire contents at once, instead trying to read the file contents in chinks of 100 characters
async function readFile(filePath) {
    try {
        await fsPromise.access(filePath); // wait until the file access completed
        const chunkSize = await determineChunkSize(filePath);
        console.log(`Using chunk size: ${chunkSize} bytes`);
        const streamOptions = {
            encoding: "UTF-8",
            highWaterMark: chunkSize // Limit each chunk to 100 characters or dynamically decide the chunk size
        };
        const readStream = createReadStream(filePath, streamOptions);

        // when a chunk of data is available to read as determined by the stream's internal buffer mechanism
        // the chunk will be passed to the listener as soon as it's available
        readStream.on("data", (dataChunk => {
            // a chunk of data available
            chunkCount++;
            chunks.push(dataChunk);
            overallData += dataChunk;

            // emit an event when the dataChunk processing completes
            fileEmitter.emit("chunkRead", chunkCount, dataChunk.length);
        }));

        // when no more data to be read from the stream
        // Means, readable stream has reached the end of the data source i..e file, HTTP response or any other streamable input
        // 'end' event should not have any parameters passed
        readStream.on("end", () => {
            fileEmitter.emit("readComplete", chunkCount, overallData.length);
        });

        // if error occurs while reading from the stream i.e. file not existing, permission issues, hardware problems etc
        readStream.on("error", (err) => {
            fileEmitter.emit("error", err);
        });

    } catch (err) {
        fileEmitter.emit("error", err);
    }
}

function askQuestion(question) {
    return new Promise((resolve, reject) => {
        readlineInterfaceWrapper.question(question, (answer) => {
            resolve(answer); // wait until the promise is resolved and the user type the answer in terminal
        });
    });
}

async function promptUser() {
    const formattedQuestion = `Enter a chunk number (1-${chunkCount}) to view its contents, or 'q' to quit: > `;
    try {
        const answer = await askQuestion(formattedQuestion);
        const formattedAnswer = answer.toString().trim().toLowerCase();

        // exit it user input 'q'->quit
        if (formattedAnswer === 'q') {
            console.log("QUITTING....");
            readlineInterfaceWrapper.close();
            return;
        }

        const chunkNumber = parseInt(formattedAnswer);
        if (isNaN(chunkNumber) || chunkNumber < 1 || chunkNumber > chunkCount) {
            console.log(`Invalid chunk number ${chunkNumber}. Please try again`);
        } else {
            console.log(`\nContents of Chunk: ${chunkNumber}: `);
            console.log(chunks[chunkNumber - 1]);
        }

        // repeatedly wait for the user input until pressed 'q'
        await promptUser(); // recursive call


    } catch (error) {
        console.error("Error in promptUser: ", error);
        readlineInterfaceWrapper.close();
    }

}


// Usage
console.log(`Reading the File ${fileToRead}....$`);
readFile(fileToRead).then(() => {
    console.log("---------------");
});


// Emitters
fileEmitter.on("error", (err) => {
    console.error("Error: ", err.message);
    readlineInterfaceWrapper.close();
});

fileEmitter.on("chunkRead", (chunkCount, dataChunkLength, err) => {
    if (err) {
        console.error("Error [event-chunkRead]: ", err);
        readlineInterfaceWrapper.close();
    } else {
        console.log(`Chunk: ${chunkCount}: ${dataChunkLength} characters`);
    }
});

fileEmitter.on("readComplete", async (totalChunk, totalCharacters) => {
    console.log(`Total Chunks: ${totalChunk}, Total Length: ${totalCharacters}`);

    // perform some requried funtion, thus to wait for its completion before proceeding
    // this will ask user to enter the chunk number to read or press 'q' to exit
    await promptUser();
});

readlineInterfaceWrapper.on("close", () => {
    console.log("GoodBye!!!");
    process.exit(0);
})


