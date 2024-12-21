// file stream example
const fsModule = require("fs");
const readlineModule = require("readline");

const readlineInterfaceWrapper = readlineModule.createInterface({
    input: process.stdin,
    output: process.stdout
});


filesToRead = "./chat-logs/sample.log";

// exit if the file doesn't exist
if (!fsModule.existsSync(filesToRead)) {
    console.log(`File ${filesToRead} no found`);
    process.exit(1);

}

// Approach-01: If reading small files (i.e. files with less strings)
// async reading the file contents ands streaming to terminal
// fsModule.readFile(
//     filesToRead,
//     "UTF-8",
//     (err, fileContents) => {
//         if (err) throw err;
//         process.stdout.write(fileContents);
//         process.stdout.write(`\nFile Read ${fileContents.length}`)
//     })

// Approach-02: If reading large file
const streamOptions = {
    encoding: "UTF-8",
    highWaterMark: 100 // Limit each chunk to 100 characters
};

// use stream approach using createReadStream() async, non-blocking
let readStream = fsModule.createReadStream(
    filesToRead,
    streamOptions
);

// once all the chunks are read
// a "data" event trigger
// streamOfFileContentChunks.once("data", (dataChunk) => {
//     console.log("Read stream started");
//     console.log("==========");
//     console.log(dataChunk);
// });

let overallData = "";
let chunkCount = 0;
const chunks = [];

readStream.on(
    "data",
    (dataChunk) => {
        chunkCount++;
        console.log(`Chunk ${chunkCount}: ${dataChunk.length} characters`);
        chunks.push(dataChunk);
        overallData += dataChunk;
    })

readStream.on("end", () => {
    console.log(`Total Chunks: ${chunkCount}`);
    console.log(`Total Characters: ${overallData.length}`);
    promptUser();
});

readStream.on("error", (err) => {
    console.log("Error reading file: ", err);
})

console.log("Reading the file...");

function promptUser(){
    const formattedQuestion=`Enter a chunk number (1-${chunkCount}) 
    to view its contents, or 'q' to quit: > `;

    readlineInterfaceWrapper.question(formattedQuestion,(answer)=>{
        if (answer.trim().toLowerCase()==='q'){
            readlineInterfaceWrapper.close();
            console.log("QUITTING....");
            return;
        }
        const chunkNumber=parseInt(answer.trim());
        if(isNaN(chunkNumber)||chunkNumber<1 || chunkNumber>chunkCount){
            console.log("Invalid chunk number. Please try again");
        }else{
            console.log(`\n Contents of chunk ${chunkNumber}: `);
            console.log(chunks[chunkNumber-1]);
        }
        //readlineInterfaceWrapper.close();
        promptUser(); // Ask again
    });
}

readlineInterfaceWrapper.on("close",()=>{
    process.exit(0);
})