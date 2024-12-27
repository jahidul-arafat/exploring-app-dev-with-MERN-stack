import {useReducer} from "react";

const scoreReducer = (state, action) => {
    switch (action.type) {
        case "increment":
            console.log("Incrementing score...");
            return state + 1; // Add 1 to the current state
        case "decrement":
            console.log("Decrementing score...");
            return state - 1; // Subtract 1 from the current state
        case "reset":
            console.log("Resetting score...");
            return 0; // Reset state to 0
        default:
            console.error(`Unknown action type: ${action.type}`);
            return state; // Return current state if action is unknown
    }
};

const [score, dispatch] = useReducer(scoreReducer, 0, () => 0);

// Initial value of score: 0
// dispatch is a function used to send actions to scoreReducer
dispatch({ type: "increment" }); // score becomes 1
dispatch({ type: "decrement" }); // score becomes 0
dispatch({ type: "reset" });     // score becomes 0
dispatch({ type: "unknown" });   // score remains 0
