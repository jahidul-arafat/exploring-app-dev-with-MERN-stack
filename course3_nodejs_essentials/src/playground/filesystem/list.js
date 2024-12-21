// list all the files in the current directory
const fsModule=require("fs"); // import the filesystem module

// read from the current directory asynchronously
fsModule.readdir("./",(err,files)=>{
    if (err){
        throw err;
    }
    console.log(files);
});                                                 // readdir-> means, reading the contents of the directory asynchronously
                                                    // readdirSyc -> means read the contents of the directory synchronously with a blocking request
                                                    // means, I am blocking the rest of the process until the file is read
console.log("reading files....."); // this will print first, since readdir is reading the files asynchronously
