// every JS file is a module
// Here, we will crete our custom module and export the variables and function so that we can use them in another modules

// we can publish our module to npm and share them to rest of the community
let count = 0;
const inc = () => ++count; // inline function
const dec = () => --count;
const getCount=()=>count;

const double = (x) => x * 2; // a function that takes a parameter
const add = (a, b) => a + b; // a function with multiple paramters
const greet = (name) => {
    return `Hello ${name}`
};

//IIFF- immediately invoked function expression
const result = ((x) => x * x)(5); // 5*5=25

// A function that returns an object
const createPerson = (name, age) => ({
    name: name,
    age: age
});

// a function with default parameters
const multiply = (a, b = 1) => a * b;

// A function that uses rest paramters
const sum = (...numbers) => numbers.reduce((acc, num) => acc + num, 0);// initially accumulator=0

// A higher-order function (returns another function)
const multiplier = (factor) => (number) => number * factor;
const mul5 = multiplier(5);
// console.log(mul5(10)); // 5*10;

// A function with destructuring in parameters
const printCoordinates = ({x, y}) => console.log(`X: ${x}, Y: ${y}`);

// Advanced inline functions with map, filter etc
// Map: Double all number in an array
const doubleAll = (numbers) => numbers.map((num) => num * 2);

// Filter: get only even numbers
const getEvenNumbers = (numbers) => numbers.filter(num => num % 2 === 0);

// get the sum of squares of even number
const sumOfSquareOfEven = (numbers) => numbers
    .filter(num => num % 2 === 0)
    .map(num => num * num)
    .reduce((acc, num) => acc + num, 0);

// get the first number greater than a threshold
const findFirstGreaterThan = (numbers, threshold) =>
    numbers.find(num => num > threshold);

// check if any number is negative
const hasNegative = (numbers) => numbers.some(num => num < 0);

// check if all numbers are positive
const allPositive = (numbers) => numbers.every(num => num > 0);

// Sort numbers in descending order
const sortDescending = (numbers) => [...numbers].sort((a, b) => b - a);

// get unique values from an array
const getUnique = (numbers) => [...new Set(numbers)];


// Export these functions if you want to use them in other modules
module.exports = {
    anything: true,
    who:"Ally",
    count,
    inc,
    dec,
    getCount
};
