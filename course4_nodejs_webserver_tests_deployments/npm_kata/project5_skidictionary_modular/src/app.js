import express from "express"; // to build our server
import {logger} from "./lib.js";
import bodyParser from "body-parser"; // npm body parsing middleware
import {getDictionary, addDictionaryTerm, updateDictionaryTerm, deleteDictionaryTerm} from './dictionary-routes.js';

import path from "path";
import swaggerUi from 'swagger-ui-express';
import YAML from "yamljs";
import { fileURLToPath } from 'url'; // Add this import

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

// Route-04: PUT method
app.put('/dictionary/:myterm', updateDictionaryTerm);

// Route-04: DELETE method -- add a delete route ("/dictionary/:term")
// to delete a dictionary item
app.delete("/dictionary/:myterm", deleteDictionaryTerm)

// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// export the app
export default app;