import express from "express"; // to build our server
import initialSkyTerms from "./data/ski-terms.json" assert {type: "json"};
import bodyParser from "body-parser"; // npm body parsing middleware
import fsModule from "fs";


// define properties for the webserver building
let skiTerms = [...initialSkyTerms]; // create a copy of initial data; not modifying the original data
const jsonParser = bodyParser.json(); // for PUT/POST requests

const app = express(); // create a new express application object, which you can use to set up routes, middleware, and other server configurations.
app.use("/", express.static(
    "./client", {
    index: "index.html", // // Set a custom index file
})); // serve the fileserver from ./client directory // This line sets up middleware to serve static files.
// app.use() is a method to mount middleware functions at a specified path.
// express.static() is a built-in middleware function in Express. It serves static files.

// add a new term to skiTerms - which is an array of objects
skiTerms.push({term: "newTerm", defined: "New definition"});

// Middleware
// insert a logging functionality before each request
// difference between app.use() and app.post()
// app.use() is a middleware function that applies to all routes.
// app.post() is a middleware function that applies to specific routes.
// app.use() will indeed be applied to app.get() routes as well as all other HTTP method routes (like app.post(), app.put(), app.delete(), etc.).
// This middleware setup provides a logging mechanism for all incoming requests, which can be very useful for debugging and monitoring your application's traffic. The bodyParser.json() middleware is crucial for handling JSON payloads in requests, especially for POST and PUT operations where you expect to receive data from the client.
app.use(jsonParser); // PUT/POST--> parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use((req, res, next) => {
    console.log(`Request: ${req.method} request for ${req.url}, [${Object.keys(req.body)}]`);

    // only specific to PUT/POST requests
    if (Object.keys(req.body).length) { // means the below code will run if the request body exists [POST request with JSON body]
        console.log("\t---------",req.body); // log the request body if it exists. This will be useful for debugging and testing.
    }
    next(); // pass control to the next middleware function in the stack
            // is compulsory to pass the control to next route or middleware function
});

// Routes
// GET method
app.get("/dictionary", (req, res) => {
    console.log(skiTerms);
    res.json(skiTerms); // server responding to the client request
});


// Default

// POST method
// to add a new item in the dictionary
// body contents must be parsed as JSON and pushed to "skiTerms"- which is an array of objects {}
// // parse incoming request bodies in a middleware before your handlers, available under the req.body property

// create a skiTerms {} body parser for JSON objects
// const jsonParser = bodyParser.json(); // the parsed object will be available under the req.body since client is requesting to add a new disctionary item
app.post("/dictionary", jsonParser, (req, res) => {
    skiTerms.push(req.body);
    save(); // save the new POST item into a file/DB called ./data/ski-terms.json
    res.json({
        status: "success",
        term: req.body
    });
});

// write the post contents to a file ./data/ski-terms.json
// This allows for better error handling and chaining of asynchronous operations
const save = () => {
    return new Promise((resolve,reject)=>{
        fsModule.writeFile("./data/ski-terms.json", JSON.stringify(skiTerms, null, 2), (err) => {
            if (err) {
                console.error("Error saving to ski-db: ",err);
                reject(err);
            }else{
                console.log(`Ski-terms DB updated with new contents`);
                resolve();
            }

        });
    })

}

// DELETE method -- add a delete route ("/dictionary/:term")
// to delete a dictionary item
app.delete("/dictionary/:myterm", (req, res) => {
    // delete the item from the array
    console.log("Request Params: ", req.params);
    const termToDelete = req.params.myterm; // term- is the route parameter (the term to delete)
    const initialLength = skiTerms.length;
    console.log(`Deleting term: ${termToDelete}`);

    // filter out the term from the array to remove it
    // {term} destructuring the term property from the object
    skiTerms = skiTerms.filter(({term}) => term !== termToDelete);

    // check if the term was found and deleted
    if (initialLength === skiTerms.length) {
        console.log(`Term ${termToDelete} not found in the dictionary`);
        res.json({
            status: "error",
            message: `Term ${termToDelete} not found in the dictionary`
        });
        return; // exit the function if the term was not found in the array
    }
    console.log(`Ski-terms DB updated after deletion`);
    save();
    res.json({
        status: "success",
        removed: termToDelete,
        newLength: skiTerms.length
    });
})

// start the express server listening at port 3000
app.listen(3000, () => {
    console.log("Ski dictionary running at http://localhost:3000")
});