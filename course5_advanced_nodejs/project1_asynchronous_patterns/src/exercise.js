import fsModule from "fs";
import path from "path";

let __dirname = path.resolve();

// define an inline delay function using callback
// const delay=(second,callback)=>{
//     if (second>3){
//         callback(new Error(`${second} seconds it too long!!`),null);
//     }else{
//         setTimeout(()=>{
//             callback(null, `the ${second} delay is over`)
//         },2000);
//     }
// }
//
// delay(2,(error,message)=>{
//     if (error){
//         console.log(error.message);
//     }else{
//         console.log(message);
//     }
// });

const delay=(second)=>{
    return new Promise((resolve,reject)=>{
        try{
            if (second>500){
                reject(new Error(`${second} seconds it too long!!`));
            }else{
                setTimeout(()=>{
                    resolve(`the ${second} delay is over`);
                },second)
            }
        }catch(error){
            console.log(error.message);
        }
    })
}

// Async function to write the promise returned messages into a log file
const writeToFile=(message)=>{
    // create a file named "delay_log.txt" into the current working directory
    return new Promise((resolve,reject)=>{
        fsModule.appendFile( // asynchronous function to append data to a file
            path.join(__dirname, "delay_log.txt"),
            `${message}\n`,
            (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    })
}

// inside an async function, wait for the promise to complete; async-await:: non-blocking
const runDelay=async(seconds)=>{
    try{
        const message=await delay(seconds);
        console.log(message);
        await  writeToFile(`Resolved: ${message}`);
    }catch (error){
        console.log(error.message);
        await writeToFile(`Rejected: ${error.message}`);
    }
}

// delay(2)
//     .then((resolvedMessage)=>{
//         console.log(resolvedMessage);
//     }).catch(error=>{
//         console.log(error.message)
// });


// Promise.all is a useful method when you want to run multiple promises concurrently and wait for all of them to complete.
// In the context of your code, we can use Promise.all to run multiple runDelay operations in parallel.
const runMultipleDelays=async(delaysToInvoke)=>{
    try{
        // execution will be paused here unless all promises are resolved or rejected
        // processing asynchronous task sequentially
        const results=await Promise.all( //  By using await, we're telling our code to pause execution at this point until all the promises have settled (either resolved or rejected).
            delaysToInvoke.map(delaySecond=>runDelay(delaySecond))
        );
        console.log("All delays completed successfully"); // will be consoled only after all the promises are resolved
    }catch(error){
        console.log(error.message)
    }
}

runMultipleDelays([400,1000,2000,3000])
    .catch(error=>{
        console.log(error.message);
    });

// runDelay(400).catch(error=>{
//     console.error(error)
// });
// runDelay(1000).catch(error=>{
//     console.error(error);
// });

