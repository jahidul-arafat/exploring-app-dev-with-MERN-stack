// import necessary modules
const {createServer} = require('http');
const {EventEmitter} = require("events").EventEmitter;

const fetchedJsonData = require('../public/person'); //require() is simpler to use. It's a synchronous operation that loads the file once when the module is first loaded
// require() automatically parses JSON files. When you require a .json file, Node.js parses it and returns the resulting JavaScript object. With file reading methods, you'd need to parse the JSON manually.
const readline = require("readline"); // user will input a 'person name' at console

// Add a custom Event Emitter which will do all the server log operations
const sEmitter = new EventEmitter();

// add a readline interface for user input
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Define port
const PORT = 3000;

// Create an array of all person name
const allPersonNames = fetchedJsonData.map(person => person.name);

// Define the server
const server = createServer((req, res) => {
    sEmitter.emit("request", req.method, req.url)
    res.setHeader('Content-Type', 'application/json');

    // split the URL to get the person name
    // i.e. http://localhost:3000/ally ; split at '/' to get the person name 'ally'
    const urlParts = req.url.toLowerCase().split('/');
    const personName = urlParts[1]; // get the name from the URL
    if (personName) {
        handlePersonRequest(req.url, res, personName);
    } else {
        handleAllPersonRequest(req.url, res);
    }

    // // add some business logic
    // switch(req.url.toLowerCase()){
    //     case "/ally":
    //         handlePersonRequest(req.url,res,"ally");
    //         break;
    //     case "/billy":
    //         handlePersonRequest(req.url,res,"ally");
    //         break;
    //     default:
    //         handleAllPersonRequest(req.url,res);
    // }
    // if (req.url.toLowerCase()==="/ally"){
    //     let ally=fetchedJsonData.filter(person=>person.name==="ally");
    //     res.end(JSON.stringify(ally));
    // } else if(req.url.toLowerCase()==="/billy"){
    //     let billy=fetchedJsonData.filter(person=>person.name==="billy");
    //     res.end(JSON.stringify(billy));
    // } else{
    //     res.end(JSON.stringify(fetchedJsonData));
    // }
});


// Functions
function handlePersonRequest(reqUrl, res, name) {
    const person = fetchedJsonData.filter(person => person.name === name);
    if (person.length > 0) {
        // if person found
        sendResponse(reqUrl, res, 200, person);
    } else {
        // if person not found
        sendResponse(reqUrl, res, 404, {message: `Person ${name} not found`});
        console.log(`Invalid person request: ${name}`); // Log invalid request
    }

}

function handleAllPersonRequest(reqUrl, res) {
    sendResponse(reqUrl, res, 200, fetchedJsonData);
}

function sendResponse(reqUrl, res, statusCode, data) {
    res.writeHead(statusCode);
    res.end(JSON.stringify(data));
    sEmitter.emit("response", reqUrl, statusCode);
}


// Start the server at port 3000
server.listen(PORT, () => {
    console.log('Server is running at http://localhost:3000/');
    ask();
})

// Event Handling
sEmitter.on("request", (method, url) => {
    console.log(`${method} request received for ${url}`);
});

sEmitter.on("response", (url, statusCode) => {
    console.log(`Response sent for ${url} with status ${statusCode}`);
})

sEmitter.on("showPersons", () => {
    console.log("Available Person Names: ", allPersonNames.join(', '));
});

sEmitter.on("serverStopping", () => {
    console.log("Server is stopping... waiting for all requests to complete");
    server.close(() => {
        console.log("Server stopped");
        readlineInterface.close();
    })

});

readlineInterface.on("close", () => {
    console.log("[Read Interface Wrapper Closed.. Cant input anymore]Goodbye!");
    process.exit(0);
})

// Error handling
server.on('error', (error) => {
    console.error(`Server error: ${error.message}`);
});

process.on('uncaughtException', (error) => {
    console.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
});

// ASK
// CLI for user input to get person details
function ask() {
    sEmitter.emit("showPersons");
    const formattedQuestion = `Enter a person name (or Press Enter for all persons): > `;
    readlineInterface.question(formattedQuestion, (answer) => {
        if (answer.trim().toLowerCase() === 'q') {
            sEmitter.emit("serverStopping");
        } else if (answer.trim()) {
            // We check if the entered name exists in the allPersonNames array
            if (allPersonNames.map(name => name.toLowerCase()).includes(answer.toLowerCase())) {
                console.log(`To get info for ${answer}, visit: http://localhost:${PORT}/${answer}`);
            } else {
                console.log(`${answer} is not a valid person name. Please try again.`);
            }
            ask();

        } else {
            console.log(`To get all persons, visit: http://localhost:${PORT}/`);
            ask();
        }
    });
}