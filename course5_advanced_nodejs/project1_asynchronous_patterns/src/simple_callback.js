// function
function hideString(inputStr, callback) {
    // hide the inputStr characters with 'X'
    setTimeout(() => {
        const hidden = inputStr.replace(/[a-zA-Z]/, 'X'); // /g is a flag that stands for "global", meaning the replace operation will be applied to all matches in the string, not just the first one
        callback(hidden);

    }, 6000); // this will be resolved after 6s
}


hideString("Hidden Message", (result) => {
    console.log(result);
});

console.log("Second Message will print first");

// minimize the callback hell with Promsies