// function
function hideString(inputStr) {
    return new Promise((resolve, reject) => {
        // if error thrown, all below code snippet becomes unreachable.
        // hide the inputStr characters with 'X'
        setTimeout(() => {
            // wrapping the string replacement in a try...catch block;
            // if successful, then callback with resolve(), else with reject()
            try {
                // let's throw an error intentionally
                // throw new Error("Intentional Error Throwing");

                // this code below become sunrechable due to error thrown
                console.log("Hiding String....");
                const hidden = inputStr.replace(/[a-zA-Z]/g, 'X'); // /g is a flag that stands for "global", meaning the replace operation will be applied to all matches in the string, not just the first one
                resolve(hidden); // its the callback
            } catch (error) {
                reject(error); // if error, then rejecting the promise; means passing a new error
            }
        }, 2000); // this will be resolved after 6s
    })

}

// Approach-01
// Using the Promise
// hideString("Hidden Message")
//     .then((result) => { // if resolve successfully
//         console.log("Hidden Message: ", result);
//     })
//     .catch(error => {
//         console.error(error);
//     });


// Approach-02
// Using Async-await
async function processingString() {
    try {
        const result = await hideString("Hidden Message");
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}

processingString().catch(error=>{
    console.log(error.message);
});


console.log("Second Message will print first");

// minimize the callback hell with Promsies