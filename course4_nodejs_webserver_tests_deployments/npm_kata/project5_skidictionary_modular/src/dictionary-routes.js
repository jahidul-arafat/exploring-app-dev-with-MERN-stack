import fsModule from "fs";
import initialSkyTerms from "../data/ski-terms.json" assert {type: "json"};
import {save} from "./lib.js";

// Define Properties
let skiTerms = [...initialSkyTerms];

// add a new term to skiTerms - which is an array of objects
// skiTerms.push({term: "newTerm", defined: "New definition"});

// GET route handler
export const getDictionary = (req, res) => {
    console.log(skiTerms);
    res.json(skiTerms);
};

// POST route handler
export const addDictionaryTerm = (req, res) => {
    const {term, defined} = req.body;
    //skiTerms.push(req.body);
    save(term, defined, true, 'add')
        .then(result => {
            console.log(result.message);
            console.log(`Saved ${result.termCount} terms to ${result.filePath}`);
            // in the browser Network Inspect--> response
            res.json({
                status: "success",
                term: req.body
            });
        })
        .catch(error => {
            console.log("Failed to save ski terms !!", error);
            res.status(500).json({
                status: "error",
                message: "Failed to save ski term"
            });
        });
};

// PUT route handler
export const updateDictionaryTerm = (req, res) => {
    const termToUpdate = req.params.myterm;
    const updatedDefinition = req.body.defined;

    // const termIndex = skiTerms.findIndex(item => item.term === termToUpdate);
    //
    // if (termIndex === -1) {
    //     console.log(`Term ${termToUpdate} not found in the dictionary`);
    //     res.status(404).json({
    //         status: "error",
    //         message: `Term ${termToUpdate} not found in the dictionary`
    //     });
    //     return;
    // }

    //skiTerms[termIndex].defined = updatedDefinition;

    save(termToUpdate, updatedDefinition, false, 'update')
        .then(result => {
            console.log(result.message);
            console.log(`Saved ${result.termCount} terms to ${result.filePath}`);
            res.json({
                status: "success",
                updated: {
                    term: termToUpdate,
                    defined: updatedDefinition
                }
            });
        })
        .catch(error => {
            console.log("Failed to save updated ski terms!", error);
            res.status(error.message.includes("not found") ? 404 : 500).json({
                status: "error",
                message: error.message
            });
        });
};

// DELETE route handler
export const deleteDictionaryTerm = (req, res) => {
    console.log("Request Params: ", req.params);
    const termToDelete = req.params.myterm;
    console.log(`Deleting term: ${termToDelete}`);

    save(termToDelete, null, false, 'delete')
        .then(result => {
            console.log(result.message);
            console.log(`Remaining terms ${result.termCount}`);
            res.json({
                status: "success",
                removed: termToDelete,
                newLength: result.termCount
            });
        })
        .catch(error => {
            console.log("Failed to save ski terms !!", error);
            res.status(error.message.includes("not found") ? 404 : 500).json({
                status: "error",
                message: error.message
            });
        });
};

