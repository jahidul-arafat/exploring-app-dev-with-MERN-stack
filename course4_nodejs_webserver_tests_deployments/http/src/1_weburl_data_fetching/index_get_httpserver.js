// fetch data from a website and serve it via HTTP
const {get} = require("https");
const {createWriteStream, readdirSync, readFileSync, existsSync, mkdirSync} = require("fs");
const {createInterface} = require("readline");
const {createServer} = require("http");
const {join, extname} = require("path");

// Define the properties
const url = "https://en.wikipedia.org/wiki/Cher";
let chunkCount = 0;
let bytesToDisplay = 100;
const downloadDir = "./downloads";
const toSaveFileName = join(downloadDir, "response.html");
let chunkList = [];

// Ensure download directory exists; if not, create it
if (!existsSync(downloadDir)) {
    mkdirSync(downloadDir);
}

// user input interface to choose the chunk to view its contents
const readlineInterfaceWrapper = createInterface({
    input: process.stdin,
    output: process.stdout
});

// Reading the data chunks in stream from the URL
const clientRequestToGetDataChunk = get(url, (res) => {
    let downloadWriteStream = createWriteStream(toSaveFileName);
    console.log("Response Started");

    res.pipe(downloadWriteStream);

    res.on("data", chunk => {
        console.log(`----Chunk[${chunkCount}]: ${chunk.length} bytes`);
        chunkCount++;
        chunkList.push(chunk.toString('utf8'));
    });

    res.on("end", () => {
        console.log("Response finished");
        console.log(`File Downloaded and Saved as ${toSaveFileName}`);
        console.log(`Total chunks received: ${chunkCount}`);

        // Ask user to choose a chunk to view its contents
        askUserForChunk();

        // Start the HTTP server to serve the downloaded file
        startHttpServer();


    });
});

// Error handling for the request; handle any errors that occur during the request
clientRequestToGetDataChunk.on("error", (err) => {
    console.error("Error during request:", err.message);
    process.exit(1);
});

// Utility Function 02: Function to validate chunk index; return true if valid, false otherwise
function isValidChunkIndex(chunkIndex) {
    return !isNaN(chunkIndex) && chunkIndex >= 0 && chunkIndex < chunkCount;
}

// Utility Function 03: Function to display chunk contents; display up to byteCount bytes of the selected chunk
function displayChunkContents(chunkIndex, byteCount) {
    const selectedChunk = chunkList[chunkIndex];
    console.log(`Contents of chunk ${chunkIndex} (up to ${byteCount} bytes): `);
    console.log(selectedChunk.slice(0, byteCount));
    console.log(".....");
}

// Utility Function 04: Function to ask the user for chunk selection; continuously ask for input until a valid chunk index is provided
// multiple attempts to ask for chunk selection are allowed
function askUserForChunk() {
    const formattedQuestion = `Enter a chunk number (0-${chunkCount - 1}) to view its contents, or 'q' to quit: > `;
    readlineInterfaceWrapper.question(formattedQuestion, (answer) => {
        if (answer.toLowerCase() === "q") {
            readlineInterfaceWrapper.close();
            return; // so then rest of the code doesn't execute'
        }

        const chunkIndex = parseInt(answer);

        if (!isValidChunkIndex(chunkIndex)) {
            console.log("Invalid chunk index. Please try again.");
            askUserForChunk();
            return; // to make sure recursive call returns
        }

        displayChunkContents(chunkIndex, bytesToDisplay);
        askUserForChunk();
    });
}

// start the HTTP server to serve the downloaded file
function startHttpServer() {
    const server = createServer((req, res) => {
        if (req.url === '/') {
            const files = readdirSync(downloadDir)
                //.filter(file => existsSync(join(downloadDir, file))) // filter out non-existing files
                .map(file => `<li><a href="/${file}">${file}</a></li>`)
                .join(''); // .join('') combines all these separate HTML strings into one continuous string.

            // server's response to a client request.
            res.writeHead(200, {'Content-Type': 'text/html'}); // // server setting up the response headers.
            res.end(`<h1>Downloaded Files</h1><ul>${files}</ul>`); // add a header with the appropriate HTTP status and content type. // // server sending the response body to the client.
        } else {
            // If a web browser requests http://localhost:3000/response.html, your server reads the content of ./downloads/response.html and sends it back to the browser.
            /*
            This creates the full path to the requested file.
            req.url.slice(1) removes the leading '/' from the URL.
            join() combines the downloadDir with the requested file name.
             */
            //console.log("Req URL: ",req.url); // /test.html
            //console.log("Req URL: ",req.url.slice(1)); // test.html -> removing the leading '/'
            const filePath = join(downloadDir, req.url.slice(1)); // example: './downloads/response.html'
            if (existsSync(filePath)) { // Checks if the requested file exists in the downloadDir.
                /*
                getContentType(filePath) determines the MIME type of the file.
                readFileSync(filePath) reads the entire file content.
                res.writeHead(200, ...) sets the HTTP status to 200 (OK) and the appropriate Content-Type.
                res.end(fileContent) sends the file content as the response.
                 */
                const contentType = getContentType(filePath);
                const fileContent = readFileSync(filePath);

                // server's response to a client request.
                res.writeHead(200, {'Content-Type': contentType});
                res.end(fileContent); // sends this content back to the client that made the request. The client then receives this content as the response to its HTTP request.
            } else { // If the requested file does not exist in the downloadDir.

                // server's response to a client request.
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end(`File ${filePath} not found`);
            }
        }
    });

    const port = 3000;
    const hostname = "localhost";
    server.listen(port, () => {
        console.log(`HTTP server running at http://${hostname}:${port}/`);
    });
}

// This getContentType function is responsible for determining the appropriate MIME type (content type) for a given file based on its extension.
function getContentType(filePath) {
    const ext = extname(filePath).toLowerCase(); // extract the file extension

    // MIME types for different file extensions are defined here. You can add more as needed.
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
    };
    return contentTypes[ext] || 'application/octet-stream'; //looks up the MIME type in the contentTypes object using the file extension.
                                                            // if no match is found, it defaults to 'application/octet-stream'
}

process.on("exit", () => {
    console.log("Exiting...");
});

readlineInterfaceWrapper.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
});