import express from "express"; // to build our server
import {logger} from "./lib.js";
import bodyParser from "body-parser"; // npm body parsing middleware
import {getDictionary, addDictionaryTerm, deleteDictionaryTerm} from './dictionary-routes.js';


// define properties for the webserver building
const app = express(); // create a new express application object, which you can use to set up routes, middleware, and other server configurations.

// Middleware
app.use(bodyParser.json()); // PUT/POST--> parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(logger);

// Routes

// Route-01: Default "/"
app.use("/", express.static(
    "./client", {
        index: "index.html", // // Set a custom index file
    }));

// Route-02: GET method
app.get("/dictionary", getDictionary);

// Route-03: POST method
app.post("/dictionary", bodyParser.json(), addDictionaryTerm);

// Route-04: DELETE method -- add a delete route ("/dictionary/:term")
// to delete a dictionary item
app.delete("/dictionary/:myterm", deleteDictionaryTerm)


// export the app
export default app;