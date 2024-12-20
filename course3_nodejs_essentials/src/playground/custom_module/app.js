// const myModule= require("./myModule"); // importing the custom module

const {inc,dec,getCount}= require("./myModule")
inc();
inc();
inc();
dec();
console.log(getCount())