// Helper function to save the updated skiTerms
import fsModule from "fs";
import path from 'path';
import {fileURLToPath} from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("filename: ", __filename);
console.log("dirname: ", __dirname);

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
        console.log("\t---------", req.body); // log the request body if it exists. This will be useful for debugging and testing.
    }
    next(); // pass control to the next middleware function in the stack
            // is compulsory to pass the control to next route or middleware function
};


// Inefficient Save() function - completely rewriting all ski-terms.json for a single update
// Helper function to save the updated skiTerms
// It will work correctly regardless of the current working directory when the script is run, and it will use the correct path separators for the operating system it's running on.
// export const save = (skiTerms) => {
//     return new Promise((resolve, reject) => {
//         const filePath = path.join(__dirname, '..', 'data', 'ski-terms.json');
//         fsModule.writeFile(filePath, JSON.stringify(skiTerms, null, 2), (err) => {
//             if (err) {
//                 console.error("Error saving to ski-db: ", err);
//                 reject(err);
//             } else {
//                 const termCount= Object.keys(skiTerms).length; // number of entries in the skiTerm DB
//                 console.log(`Ski-terms DB updated with ${termCount} entries`);
//                 resolve({
//                     filePath,
//                     termCount,
//                     message: `Ski-terms DB updated successfully`
//                 });
//             }
//         });
//     });
// };

// Updated save() function
// Why used return after default and else blocks?
// Answer: These return statements are a good practice in Promise-based functions, especially when dealing with error conditions, as they help maintain clear and predictable control flow in your asynchronous operations.
export const save = (termOrTerms, definition = null, isNew = false, operation = "update") => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '..', 'data', 'ski-terms.json');

        let skiTermDB;
        let message;

        if (Array.isArray(termOrTerms)) {
            // Bulk update: replace the entire contents
            skiTermDB = termOrTerms;
            message = "Ski-terms DB successfully updated with BULK data";
        } else { // if an individual term
            // read the existing file for individual term operations
            try {
                const skiTermData = fsModule.readFileSync(filePath, 'utf8');
                skiTermDB = JSON.parse(skiTermData);
            } catch (parseErr) {
                console.error("Error parsing ski-db: ", parseErr);
                reject(parseErr);
                return;
            }
        }

        // individual Term operations (add, update, delete)
        switch (operation) {
            case 'add':
            case 'update':
                if (isNew || operation === 'add') { // add operation
                    skiTermDB.push({term: termOrTerms, defined: definition});
                    message = `Ski-term "${termOrTerms}" added successfully`;
                } else { // update operation
                    const updateIndex = skiTermDB.findIndex(item => item.term === termOrTerms);
                    if (updateIndex !== -1) { // means, item to update is found
                        skiTermDB[updateIndex].defined = definition;
                        message = `Ski-term "${termOrTerms}" updated successfully`;
                    } else {
                        console.log(`Term "${termOrTerms}" not found for update`);
                        reject(new Error(`Term "${termOrTerms}" not found for update`));
                        return; // Maintain promise chain integrity: In a Promise-based function, it's important to ensure that you don't accidentally resolve after rejecting, or vice versa. The return statement helps prevent this.
                    }
                }
                break;
            case 'delete':
                const initialLength = skiTermDB.length;
                skiTermDB = skiTermDB.filter(item => item.term !== termOrTerms); // get the skiTermDB excluding the item marked to delete
                if (initialLength === skiTermDB.length) { // if still both length remains same, means, nothing to delete
                    console.log(`Term "${termOrTerms}" not found for deletion`);
                    reject(new Error(`Term "${termOrTerms}" not found for deletion`));
                    return;
                }
                message = `Ski-term "${termOrTerms}" deleted successfully`;
                break;
            default:
                console.log(`Invalid operation: ${operation}`);
                reject(new Error(`Invalid operation: ${operation}`));
                return; // This ensures that an invalid operation immediately stops the function and rejects the promise.
        }

        // Write updated skiTermDB back to file
        fsModule.writeFile(filePath, JSON.stringify(skiTermDB, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error saving to ski-db: ", writeErr);
                reject(writeErr);
            } else {
                console.log(message);
                resolve({
                    filePath,
                    termCount: skiTermDB.length,
                    message: message
                });
            }
        });
    });
};