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
    skiTerms.push(req.body);
    save(skiTerms);
    res.json({
        status: "success",
        term: req.body
    });
};

// DELETE route handler
export const deleteDictionaryTerm = (req, res) => {
    console.log("Request Params: ", req.params);
    const termToDelete = req.params.myterm;
    const initialLength = skiTerms.length;
    console.log(`Deleting term: ${termToDelete}`);

    skiTerms = skiTerms.filter((item) => item.term !== termToDelete);

    if (initialLength === skiTerms.length) {
        console.log(`Term ${termToDelete} not found in the dictionary`);
        res.json({
            status: "error",
            message: `Term ${termToDelete} not found in the dictionary`
        });
        return;
    }
    console.log(`Ski-terms DB updated after deletion`);
    save(skiTerms);
    res.json({
        status: "success",
        removed: termToDelete,
        newLength: skiTerms.length
    });
};

