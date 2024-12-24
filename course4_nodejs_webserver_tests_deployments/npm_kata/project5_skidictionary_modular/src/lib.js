// Helper function to save the updated skiTerms
import fsModule from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("filename: ",__filename);
console.log("dirname: ",__dirname);

// logger
// insert a logging functionality before each request
// difference between app.use() and app.post()
// app.use() is a middleware function that applies to all routes.
// app.post() is a middleware function that applies to specific routes.
// app.use() will indeed be applied to app.get() routes as well as all other HTTP method routes (like app.post(), app.put(), app.delete(), etc.).
// This middleware setup provides a logging mechanism for all incoming requests, which can be very useful for debugging and monitoring your application's traffic. The bodyParser.json() middleware is crucial for handling JSON payloads in requests, especially for POST and PUT operations where you expect to receive data from the client.
export const logger = (req, res, next) => {
    console.log(`Request: ${req.method} request for ${req.url}, [${Object.keys(req.body)}]`);

    // only specific to PUT/POST requests
    if (Object.keys(req.body).length) { // means the below code will run if the request body exists [POST request with JSON body]
        console.log("\t---------",req.body); // log the request body if it exists. This will be useful for debugging and testing.
    }
    next(); // pass control to the next middleware function in the stack
            // is compulsory to pass the control to next route or middleware function
};



// Helper function to save the updated skiTerms
// It will work correctly regardless of the current working directory when the script is run, and it will use the correct path separators for the operating system it's running on.
export const save = (skiTerms) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '..', 'data', 'ski-terms.json');
        fsModule.writeFile(filePath, JSON.stringify(skiTerms, null, 2), (err) => {
            if (err) {
                console.error("Error saving to ski-db: ", err);
                reject(err);
            } else {
                console.log(`Ski-terms DB updated with new contents`);
                resolve();
            }
        });
    });
};