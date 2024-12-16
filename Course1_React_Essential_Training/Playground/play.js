// Expressions are logged without needing console.log() 🤯

/*
* Activate RunJS to remove limits and do more things, including:
* - installing NPM packages
* - opening multiple tabs
* - creating snippets
* - and supporting the continued development of RunJS 😀
*
* Happy Coding! 🎉
*/

const toUpper = str => str.toUpperCase();
console.log(toUpper("Hello"))

const createUser = (mName,mAge)=>(
    {
        name: toUpper(mName),
        age: mAge
    }
);

console.log(createUser("Alice",25))

// Create an array of dishes and then transform each dishes into a dish object and return that dish object
// since Dishes is an array, we have to use map
const dishList=[
    "Rice",
    "Potato Fry",
    "Fish Fry",
    "Soup"
];

for(const dish of dishList){
    console.log("The dish is: ", dish, "\n")
}

const dishObjects = dishList.map(
    (dish,i)=>
        (
            {
                id: i,
                title: dish
            }
        )
);
console.log(dishObjects);

// 1. Arrow function with ternary operators
const toggleStatus = (currentStatus)=>currentStatus==="Open"? "Closed":"Open";
console.log(toggleStatus("Open")) // Closed
console.log(toggleStatus("Closed")) // Open

// 2. One-Liner arrow functions
const add = (a,b)=>a+b;
console.log(add(10,20));

// 4. Filtering with Array methods and arrow functions
const numList=[1,2,3,4,5];
const evenNumList= numList.filter(num=>num%2===0);
console.log(evenNumList);

// 5. Short-Circuting with Ternary Operator
const getUsernName=(user)=> user?user:"Default Name";
console.log(getUsernName("Ally"))
console.log(getUsernName())

// find the expensive items
const itemList=[
    {name:"Laptop", price:1200},
    {name:"Phone", price:250},
    {name:"Pen", price:2},
    {name:"Monitor", price:700},
];
console.log(itemList.at(-1))

// Process
// 1. Filter items that cost more than $100
// 2. Sort them by price descending
// 3. Map them to strings, using ternaries to highlight expensive items
// {} -> means object destructuring to directly refering to its properties
const expensiveItemDescription = itemList
    .filter(({price})=> price>100)
    //.filter(item=>item.price>100)
    .sort((item1,item2)=>item2.price-item1.price)
    .map(({name,price})=>price>1000? `${name}:$${price} (Luxury!)`: `${name}: $${price}`)
console.log(expensiveItemDescription)

// Nested Arrows and Partial Applications
// Example-01: Demostrating Function Factory
const multiply=a=>b=>a*b;
const doubleValueFunc=multiply(2); // create a function called doubleValueFunc
console.log(doubleValueFunc(5));

// Example-02: A function factory that creates user objects
const createUserWithRole=role=>(name,age)=>({name,age,role});
const createAdmin=createUserWithRole("admin");
console.log(createAdmin("Ally",25));

// Advanced Array transformations with Destructuring and Ternaries
// Process an array of user objects, compute averages, filter them by scores and tag them based on conditions
const data = [
    {name:"Ally", scores:[90,90,90]},
    {name:"Billy", scores:[90,80,80]},
    {name:"Cilly", scores:[70,60,90]}
];

console.log(data)
// arrow function to get the average of an array
const average = arr=> arr.reduce((sum,val)=>sum+val,0)/arr.length;
//console.log(average([1,2,3]))

// categorizing a user by their average score using a ternary chain
const categorizeUser = avgScore=>
    avgScore>=90?"elite"
        : avgScore>=80?"top-performer"
            : avgScore>=70?"regular"
                :"begineer";
//console.log(categorizeUser(average([70,80,90])))

// Transform the data:
// 1. compute average scores
// 2. Filter to include only those with avgScore>=80
// 3. Add a category field based on their avgScore
// 4. Convert to a summary string
const result= data
    .map(({name,scores})=>({name, avgScore:average(scores)}))
    .filter(({avgScore})=>avgScore>=80)
    .map(({name,avgScore})=>({name, avgScore,category:categorizeUser(avgScore)}))
    .map(({name, avgScore,category})=>`${name} [${category}:${avgScore.toFixed(2)}]`)

console.log("Result: ",result);

// Produce a new object (without Parameters)
// Return a new object everytime it's called
const createDefaultUser=()=>({name:"Aninymous", active: true});
console.log(createDefaultUser())




