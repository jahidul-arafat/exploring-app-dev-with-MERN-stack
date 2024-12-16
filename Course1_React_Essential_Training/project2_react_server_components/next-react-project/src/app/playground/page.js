// Learning Asynchronous Coding in JS

// Old legacy way to handle async programming
// Example-1: Using the callback
// Schedule a piece of code to run after a certain amount of time, without stopping other code from running
console.log("Start....");

// setTimeout(arg1:callbackfunction, arg2:timer)
const callback = (timeescaped) => {// {} is an object, its the function body
    console.log(`Calling after ${timeescaped} seconds`)
};
const timetoescape = 2000;

// must not directly pass the callback() function to setTimeout
// this might try to immediately invoke the callback() function
// instead of immediately invoking the callback function, we wrap it in an arrow function.
// this wrapping ensures that the callback is passed as a function to be executed later
setTimeout(()=>callback(timetoescape), timetoescape);

console.log("End"); // this will run immediately after setting the 2000ms(2s) timer
                    // after 2s, the callback is passed to setTimeout finally runs and prints the msg in the console.


// // Old legacy way to handle async programming
// Example-2: Passing the callback function as argument in another function
const myCallBack = (input)=>{
    console.log("Received", input);
};

function fetchData(myCallBack){
    // simulate data fetching
    const userList =["Ally","Billy"];
    const userListMapped= userList.map(
        (name)=>
            ({name,age:name.length*10})
    );
    myCallBack(userListMapped)
}
fetchData(myCallBack)

//  Modern way of handling asynchronous operation.
// Example-3: Promises with .then() callback or using async--await
// A promise represents a value that might not be available yet.
// attach .then() callbacks to run code after the promise resolves
/*

// The new Promise(...) constructor takes one argument: an executor function.
// The executor function is given two arguments by the Promise system: resolve and reject
const myPromise = new Promise((resolve, reject) => {
  // Your asynchronous code goes here
  // Call resolve(value) if successful // a function to call if the async operation completes successfully
                                        // will make the promise transition from "pending" to "fulfilled" with the "value" as a result
  // Call reject(error) if something goes wrong // a function to call of the async operation fails
                                                // will make the promise transition from "pending" to "rejected" with "error" as the reason
});

 */

/*
Why Promises?
====================
They make code more readable than nested callbacks.
They separate the asynchronous operation (the promise) from what you do with the results (.then()).
 */

function fetchDataWithPromise(){
    // return a new promise
    // syntax: new Promise(arg1: anExecutorFunction)
    return new Promise((resolve,reject)=>
    {
        // all async operations
        // simulate data fetching
        // intentionally used setTimeout, so that resolve doesnt return the data immediately, but after 3second
        setTimeout(()=>{
            const userList =["Ally","Billy"];
            const userListMapped= userList.map(
                (name)=>
                    ({name,age:30})
            );
            resolve(userListMapped); // a function to call if the async opearation completes successfully

        },3000);

    });
}

// async/await is built on top of promises but makes code look more like “normal” synchronous code.
// await stops the execution inside an async function until the promise resolves,
// but without blocking the entire program.

// Note: In JavaScript, async/await inherently works with promises, so it's not possible to use async/await without some form of promises under the hood.
// However, you can simulate an asynchronous operation without explicitly creating a new Promise by using built-in APIs like setTimeout,
// which are asynchronous but do not return promises directly.

// async/await is syntactic sugar over promises. When you use await, it pauses the function execution until the promise is resolved or rejected.
async function getUserDataFromPromise(){
    console.log("Fetching data with a promise...");
    const arrivedData= await fetchDataWithPromise(); // Wait until fetchUser finishes
    console.log("Promised Received: ", arrivedData); // if await not used - pending promise, not resolving the data; doesnt print any data into the console
}
// fetchDataWithPromise()
//     .then(arrivedData =>{ // used .then() on the promise to specify what to do when the data arrives
//         console.log("Promised Received: ", arrivedData)
//     });
getUserDataFromPromise();
console.log("This logs immediately, not waiting for data");

