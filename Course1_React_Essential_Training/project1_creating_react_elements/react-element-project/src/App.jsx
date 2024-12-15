// Managing states in react application is very important
// The most modern way to handle a state variable in App is to use a function called 'useState'
// import only the useState function from the React module
// useState is a named import; you can import multiple named exports in the same statement
// useState function will update the state of our application
import {useState, useState as useStateHook} from "react"; // use {} for named imports in JavaScript i.e. functions, objects, values that are exported by name from a module
import './App.css'
// we will be adding some images to render from the ./images' directory'
import image1 from "./images/image1.jpeg"

// import react fragement
// import React from "react";

// create some variables what we gonna pass int he JSX
let language = "React JavaScript  ";

// create a 'user' object
const user = {
    name: "Alice",
    age: 30
};
const fruits = ["apple", "banana", "cherry"]

// create a list of items, these items will be rendered by Component-3/Main()
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// create a list of dished
const dishes = [
    "Rice",
    "Potato Fry",
    "Fish Fry",
    "Soup"
]


// Lets create another component
// Component-2/Header -- will be rendered by Component-01/App
// This is a CHILD Component
// Accessing the passed properties from Component-01/App as arguments
// Lets not pass the entire 'props' object, destructing it
// since 'props' is an object, the object destructor {} is used
// cant use [] array destructor here bcoz 'props' is an object, not an array
function Header({name, year, school}) {
    console.log(name, year, school)
    return (
        // return a UI that gonna be used by main.jsx for rendering in the index.html
        // all the JSX fragments must be wrapped with a Tag
        // here, two adjacent JSX fragment <div> and <header> is wrapped with a wrapper tag <div>
        // this gonna JUNG up the DOM tree
        // Solution: Use <React.Fragment> instead of wrapper <div>
        <>
            <div>
                <h5>This is a div - using old school JSX wrapper</h5>
            </div>
            <header>
                <h1> {name}'s React Block {language.toUpperCase()}!! {user.name}, {fruits.at(-1)}</h1>
                <h2>Welcome to this beautiful restaurent of {name}</h2>
                <p>Copyeright @{school}/{year}</p>
            </header>
        </>

    );
}

// Component-4/Dish/Child Component of App
// Error to resolve: Each child in a list should have a unique "key" prop.
// convert each "dish" into a "dishObject" having an "id" and "title" to resolve the error
const dishObjects = dishes.map((dish, i) =>
    ( // return
        {
            id: i, // key
            title: dish
        }
    )
);

console.log("Dish Objects: ", dishObjects)

// destructuring the 'props' object
function Dish({dishObjs}) {
    console.log("Dishes[inside child]: ", dishes)
    return (
        // if you are dealing with array of objects, must use 'key' as an identifier for that object to avoid the console error
        // why key is important? as our application data changes over time
        <ul>
            {dishObjs.map((dish) =>
                <li key={dish.id} style={{listStyleType: "none"}}>{dish.title}</li>
            )}
        </ul>
    );
}


// Component-3/PrintNumber/Child Component of App
// destructuring the 'numList' from 'props' object
function PrintNumber({numList}) {
    console.log(numList)
    return (
        // lets return an unordered list and the list should have a few different items
        // {} is a JSX expression used in <ul>
        <ul>
            {numList.map(num => (
                <li>{num * 100}</li> // for each of the number return a list item that gonna be rendered
            ))}
        </ul>
    );
}


// Component-4/ImageRender/Child of Component-1/App
// destructuring the 'Props' object
function ImageRender({image, title}) {
    console.log("Image: ", image, "Title: ", title)
    return (
        <div>
            <img
                src={image}
                //src="https://github.com/eveporcello.png"
                height={200}
                alt={title}
            />
        </div>
    );
}

// Component-5/ RestaurantOpenStatus
// destructuring the Props object
function RestaurantStatus({openStatus, onStatus}){
    //const [status, setStatus]=stateArray // array destructuring

    // create a toggle
    // toggling a single value between two states
    // There's no need for map here because we're not working with an array or transforming multiple items.
    const toggleStatus = ()=> {
        onStatus(openStatus==="Open"?"Closed":"Open")
    };
    return(
        <div>
            <h1>The restaurant is {openStatus}</h1>
            {/*<button onClick={()=>setStatus("Close")}>Close Restaurant</button>*/}
            {/*<button onClick={()=>setStatus("Open")}>Open Restaurant</button>*/}
            <button onClick={toggleStatus}>{openStatus==="Open"?"Close":"Open"} Restaurant</button>
        </div>

    )
}

// Component-1 : Default to all importer (Parent Component)-> it display the Component-02/Header
// App is our first component which gonna be rendered using main.jsx
// Components are like little building block
// its a piece of UI that we gonna use to describe one part of our application



// in the Component-1/App we gonna use the 'useState' function
function App() {
    const [status, setStatus] = useState("Open"); // make sure to create the state variable at highest level you can
    // and then passed that down as a property to RestaurantStatus
    // console.log("useState Return: ",status, setStatus);

    // Error to Adjust: Adjacent JSX elements must be wrapped in an enclosing tag.
    // passing down properties for the Component-2/Header
    return (
        <>
            <h5>Parent Component/Restaurant Status {status}</h5>
            <button onClick={()=>setStatus(status==="Open"?"Closed":"Open")}>
                {status==="Open"?"Close":"Open"} All Restaurant
            </button>


            <RestaurantStatus openStatus={status} onStatus={setStatus}  />

            {/*// multiple top level elements must be wrapped in an enclosing tag. Here <div> is the enclosing tag*/}
            {/*// Use the Component-1/App to render the component-1/Header*/}
            {/*// Passing the property i.e. name="Billy" to Component-2/Header*/}



            <Header name="Ally" school="AU/CSSE" year={new Date().getFullYear()}/>
            {/*<PrintNumber numList={items}/>*/}
            <ImageRender image={image1} title={"Photo of a Similing Student"}/>
            <Dish dishObjs={dishObjects}/>
        </>
    ); // first component
    // this is not HTML, infact JSX - to write HTML like syntax in react component

    //


    // Vite Generated Code -- Remove these
    //   // Define the Array Destructor to hold the values returned by the React useState hook.
    //   const stateArray = useState(100)
    //   const count = stateArray[0] // current state count
    //   const setCount= stateArray[1] // update the state count
    //
    // //const [count, setCount] = useState(0) // shortcut approach, using the array destructor
    //
    //
    // return (
    //   <>
    //     <div>
    //       <a href="https://vite.dev" target="_blank">
    //         <img src={viteLogo} className="logo" alt="Vite logo" />
    //       </a>
    //       <a href="https://react.dev" target="_blank">
    //         <img src={reactLogo} className="logo react" alt="React logo" />
    //       </a>
    //     </div>
    //     <h1>My React Project!</h1>
    //     <div className="card">
    //       <button onClick={() => setCount((count) => count + 1)}>
    //         count is {count}
    //       </button>
    //       <p>
    //         Edit <code>src/App.jsx</code> and save to test HMR
    //       </p>
    //     </div>
    //     <p className="read-the-docs">
    //       Click on the Vite and React logos to learn more
    //     </p>
    //   </>
    // )
}

export default App
