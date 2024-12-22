// import modules
const {createServer} = require("http");
const readline=require("readline"); // for user input to press 'q' to quit the webserver
const {EventEmitter}= require("events")


// Define required properties
const listeningPort=3000;
const hostname="localhost";
const sEmitter=new EventEmitter(); // create a custom event emitter

// MIME types for different file extensions are defined here. You can add more as needed.
function getContentType(extension = ".html") {
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.plain': 'text/plain'
    };
    //const ext = path.extname(filePath).toLowerCase(); // extract the file extension
    return contentTypes[extension] || 'application/octet-stream'; // return default MIME type if no specific type is found.
}


function getHtmlTemplate(request) {
    return `
<!DOCTYPE html>
<html lang="">
<body>
    <h1>Serving HTML Text</h1>
    <p>${request.method} request made for ${request.url}</p>
</body>
</html>
`;
}


// define the server
const server=createServer((req, res) => {
    // Emit an event when a URL is browser
    sEmitter.emit("urlBrowsed",req.url);

    if (req.url === '/') {
        // server's response to a client request.
        res.writeHead(200, {'Content-Type': getContentType()});   // server setting up the response headers.
        console.log(`Received a ${req.method} request for ${req.url}`); // logging the request method and URL.
        res.end(getHtmlTemplate(req)); // server sending the response body to the client.
    } else if (req.url === '/headers') {
        console.log("Request Details: ", req.headers); // logging the request headers.
        res.writeHead(200, {'Content-Type': getContentType(".plain")});   // server setting up the response headers.

        // converting the request headers object to a string and sending it as the response body.
        const headersString=Object.entries(req.headers)
            .map(([key,value])=>`${key}:${value}`) // Using Object.entries() to get an array of key-value pairs from the headers object.
            .join("\n");
        res.end("Requested Headers\n========================\n\n"+headersString); // server sending the response body to the client.
    }

});

// start the webserver listening at port 3000
server.listen(listeningPort,()=>{
    console.log(`Server listening at http://${hostname}:${listeningPort}`);
    console.log("Press Q to terminate the server >> ");
});

// setup readline interface for user input to quit the server
const readlineInterface=readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Listen for 'Q' key press and close the server when it is received
// Added an event listener for the 'line' event, which checks if the input is 'q' or 'Q'.
// The readline.Interface object automatically emits 'line' events when the user enters a line of text (by pressing Enter). We don't need to explicitly call readlineInterface.line().
readlineInterface.on("line",(input)=>{
    if (input.toLowerCase()==='q'){
        console.log("Terminating the server....");
        readlineInterface.close(); // after this, you can no longer receive user input through it
        server.close(()=>{
            sEmitter.emit("serverClosed");
        });
    } else{
        console.log("Press 'Q+Enter' to terminate the server > ")
    }
});

// Event
readlineInterface.on("close",()=>{
    console.log("Readline Interface Closed... No longer user input allowed XXX")
    process.exit(0);

});

sEmitter.on("urlBrowsed",(url)=>{
    console.log(`URL Browsed: ${url}`);
});

sEmitter.on("serverClosed",()=>{
    console.log("Server has been terminated.");
    process.exit(0);
})
