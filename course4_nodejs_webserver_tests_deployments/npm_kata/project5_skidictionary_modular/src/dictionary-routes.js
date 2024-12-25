import fsModule from "fs";
import initialSkyTerms from "../data/ski-terms.json" assert {type: "json"};
import {save} from "./lib.js";
import path from "path";
import {fileURLToPath} from "url";


// Define Properties
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let skiTerms = [...initialSkyTerms];

// Function to update skiTerms
const updateSkiTerms = () => {
    const filePath = path.join(__dirname, '..', 'data', 'ski-terms.json');
    const data = fsModule.readFileSync(filePath, 'utf8');
    skiTerms = JSON.parse(data);
};

// add a new term to skiTerms - which is an array of objects
// skiTerms.push({term: "newTerm", defined: "New definition"});

// GET /dictionary route handler
export const getDictionary = (req, res) => {
    updateSkiTerms();
    console.log(skiTerms);
    res.json(skiTerms);
};

// Search Dictionary terms
// GET /dictionary/search?q=<search_term>
export const searchDictionary = (req, res) => {
    const searchTerm = req.query.q.toLowerCase();
    updateSkiTerms();
    const results = skiTerms.filter(item =>
        item.term.toLowerCase().includes(searchTerm) ||
        item.defined.toLowerCase().includes(searchTerm)
    );
    res.json(results);
};

// Get Random terms
// GET /dictionary/random
export const getRandomTerm = (req, res) => {
    updateSkiTerms();
    const randomIndex = Math.floor(Math.random() * skiTerms.length);
    res.json(skiTerms[randomIndex]);
};

// GET multiple terms
// GET /dictionary/terms?ids=term1,term2,term3
export const getMultipleTerms = (req, res) => {
    updateSkiTerms();
    const termIds = req.query.ids.split(',').map(term => term.trim().toLowerCase());
    const foundTerms = skiTerms.filter(item =>
        termIds.includes(item.term.toLowerCase())
    );

    // Log any terms that were not found
    const notFoundTerms = termIds.filter(id => !foundTerms.some(term => term.term.toLowerCase() === id));
    if (notFoundTerms.length > 0) {
        console.log("Terms not found:", notFoundTerms);
    }

    console.log("Found terms: ",foundTerms);
    console.log("Not Found terms: ",notFoundTerms);
    res.json({
        found: foundTerms,
        notFound: notFoundTerms
    });
};

// Add Multiple Terms
// POST /dictionary/bulk
export const addMultipleTerms = async (req, res) => {
    const newTerms = req.body;
    let addedTerms = [];
    let skippedTerms = [];
    let errors = [];

    try {
        updateSkiTerms(); // Ensure we have the latest terms

        for (let term of newTerms) {
            if (skiTerms.some(existingTerm => existingTerm.term.toLowerCase() === term.term.toLowerCase())) {
                console.log(`Term "${term.term}" already exists. Skipping.`);
                skippedTerms.push(term.term);
            } else {
                try {
                    await save(term.term, term.defined, true, 'add');
                    addedTerms.push(term);
                } catch (error) {
                    errors.push({ term: term.term, error: error.message });
                }
            }
        }

        updateSkiTerms(); // Update skiTerms after adding new terms

        // Log skipped terms
        if (skippedTerms.length > 0) {
            console.log("Skipped terms (already exist):", skippedTerms.join(", "));
        } else {
            console.log("No terms were skipped.");
        }

        res.json({
            status: "success",
            addedTerms: addedTerms.length,
            terms: addedTerms,
            skippedTerms: skippedTerms,
            errors: errors
        });
    } catch (error) {
        console.log("Failed to process multiple ski terms!", error);
        res.status(500).json({
            status: "error",
            message: "Failed to process multiple ski terms",
            error: error.message
        });
    }
};

// GET dictionary statistics
// GET /dictionary/stats
export const getDictionaryStats = (req, res) => {
    updateSkiTerms();
    const stats = {
        totalTerms: skiTerms.length,
        averageDefinitionLength: skiTerms.reduce((acc, term) => acc + term.defined.length, 0) / skiTerms.length,
        longestTerm: skiTerms.reduce((longest, term) => term.term.length > longest.length ? term.term : longest, ""),
        shortestTerm: skiTerms.reduce((shortest, term) => term.term.length < shortest.length ? term.term : shortest, skiTerms[0].term)
    };
    res.json(stats);
};

// POST route handler
export const addDictionaryTerm = (req, res) => {
    const {term, defined} = req.body;
    //skiTerms.push(req.body);
    save(term, defined, true, 'add')
        .then(result => {
            console.log(result.message);
            console.log(`Saved ${result.termCount} terms to ${result.filePath}`);
            updateSkiTerms(); // Update skiTerms after successful save
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
    save(termToUpdate, updatedDefinition, false, 'update')
        .then(result => {
            console.log(result.message);
            console.log(`Saved ${result.termCount} terms to ${result.filePath}`);
            updateSkiTerms(); // Update skiTerms after successful save
            res.json({
                status: "success",
                updated: {
                    term: termToUpdate,
                    defined: updatedDefinition
                }
            });
        })
        .catch(error => {
            console.log("Failed to save updated ski terms!", error.message);
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
            updateSkiTerms(); // Update skiTerms after successful save
            res.json({
                status: "success",
                removed: termToDelete,
                newLength: result.termCount
            });
        })
        .catch(error => {
            console.log("Failed to save ski terms !!", error.message);
            res.status(error.message.includes("not found") ? 404 : 500).json({
                status: "error",
                message: error.message
            });
        });
};

