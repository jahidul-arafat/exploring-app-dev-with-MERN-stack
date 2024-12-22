// fetch data from a website
// import modules
const httpsModule = require("https"); // import https module
const fsModule=require("fs"); // import filesystem module
const readlineModule=require("readline"); // for user input to choose the chunk to see its contens

// Define the properties
// https://en.wikipedia.org/wiki/Cher
const httpsRequestOptions={
    hostname: "en.wikipedia.org",
    port: 443,
    path: "/wiki/Cher",
    method: "GET"
};

let chunkCount=0;
let bytesToDisplay=100; // let's display the 100 bytes of any selected chunk
const toSaveFileName="./response.html";
let chunkList=[];

const readlineInterfaceWrapper = readlineModule.createInterface({
    input: process.stdin,
    output: process.stdout
    // terminal: false, // to prevent readline from blocking the terminal
});

// Reading the data chunks in stream from the URL
// Make the https request
const clientRequestToGetDataChunk=httpsModule.request(httpsRequestOptions, (res,err)=>{
    if (err){
        console.error("Error Triggered: ",err);
        process.exit(1);
    }
    let responseBody="";
    res.setEncoding("UTF-8");

    // trigger the event when dataChunk is received from the weburl
    res.on("data",chunk => {
        console.log(`----Chunk[${chunkCount}]: ${chunk.length} bytes`);
        chunkCount++;
        responseBody+=chunk;

        // push the chunk into chunkList
        chunkList.push(chunk);
    });

    // add an event listener for when the response ends
    res.on("end",()=>{
        console.log(`Request completed. Total chunks received: ${chunkCount} bytes`);
        console.log(`Total response body length: ${responseBody.length} bytes`);

        // write the responsBody into a file "response.html"
        fsModule.writeFile(toSaveFileName,responseBody, (err)=>{
            if (err) throw err;
            console.log(`File Downloaded and Saved as ${toSaveFileName}`);
        })

        // Ask user to choose a chunk to view its contents
        askUserForChunk();
    })
});

// closing up the request (aka ClientRequest)
clientRequestToGetDataChunk.end();

// Utility Functions
// Utility Function 01: Function to validate chunk index
function isValidChunkIndex(chunkIndex){
    if(isNaN(chunkIndex)||chunkIndex<0||chunkIndex>=chunkCount){
        console.log(`Invalid Chunk Number: ${chunkIndex}; Please try again.`);
        return false;
    }
    return true; //valid chunk index
}

// Utility Function 02: Display chunk contents
function displayChunkContents(chunkIndex, byteCount){
    const selectedChunk= chunkList[chunkIndex];
    console.log(`Contents of chunk ${chunkIndex} (upto ${byteCount} bytes): `);
    console.log(selectedChunk.slice(0,byteCount));
    console.log(".....");
}

// Main Function to ask user for chunk selection
function askUserForChunk(){
    const formattedQuestion=`Enter a chunk number (0-${chunkCount - 1}) to view its contents, or 'q' to quit: > `;
    readlineInterfaceWrapper.question(formattedQuestion,(answer)=>{
        // quit if 'q'
        if (answer.toLowerCase()==="q"){
            readlineInterfaceWrapper.close();
            return; // so then rest of the code doesn't execute
        }

        // else, get the chunk number and fetch the chunk contents (upto 100 bytes)
        const chunkIndex=parseInt(answer);

        // keep asking user to input chunk index, until a valid index is passed
        if(!isValidChunkIndex(chunkIndex)){
            askUserForChunk(); // recursive call
            return; // to make sure recursive call returns
        }

        // display the chunk
        displayChunkContents(chunkIndex,bytesToDisplay);

        // Ask for another chunk
        askUserForChunk(); // recursive call; will only end when 'q' in typed

    })
}





// Event Trigger
process.on("exit",()=>{
    console.log("Exiting ...");
});

readlineInterfaceWrapper.on("close",()=>{
    console.log("Closing the RL wrapper");
    process.exit(0);
})





