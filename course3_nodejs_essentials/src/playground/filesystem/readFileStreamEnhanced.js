// import required modules
const fsPromise=require("fs").promises; // for file I/O operation; async+non-blocking // implicit promises
const {createReadStream}=require("fs"); // to create a read stream of the input large file
const readlineModule=require("readline"); // for user input from terminal
const {EventEmitter}=require("events").EventEmitter;