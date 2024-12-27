// useEffect hook-> has no direct effect on the react components, but has side effects
// handling useEffect hook could be tricky
import {useReducer, useEffect} from "react"; // use {} for named imports in JavaScript i.e. functions, objects, values that are exported by name from a module
import './App.css'
import image1 from "./images/image2.jpeg"

// create some variables what we gonna pass int he JSX
let language = "React JavaScript  ";

// create a 'user' object
const user = {
    name: "Alice",
    age: 30
};


// create a list of dished
const dishes = [
    "Rice",
    "Potato Fry",
    "Fish Fry",
    "Soup"
]


function Header({name, year, school}) {
    console.log(name, year, school)
    return (
        <>
            <div>
                <h5>This is a div - using old school JSX wrapper</h5>
            </div>
            <header>
                <h1> {name}'s React Block {language.toUpperCase()}!! {user.name}</h1>
                <h2>Welcome to this beautiful restaurent of {name}</h2>
                <p>Copyright @{school}/{year}</p>
            </header>
        </>

    );
}

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
function RestaurantStatus({openStatus, onStatus}) {
    return (
        <div>
            <h1>The restaurant is {openStatus?"Open":"Closed"}</h1>
            <button onClick={onStatus}>{openStatus? "Close" : "Open"} Restaurant</button>
        </div>

    )
}

// Main component
function App() {
    const [status, toggle] = useReducer(
        (status)=>!status, // argument1-> the reducer function // toggle - will invoke the reducer function (which toggles the boolean value)
        true); // argument2
    console.log("useReducer: ", status,toggle)

    // Add useEffect(aCallBackFunction, aDependencyArray) hook
    // The first argument to useEffect is a function. This function will be executed after every render of the component.
    // Option-01: make sure to call the useEffect when the app is first render, for subsequent calls, it will not be called
    // Option-02: make sure to call the useEffect whenever a certain value changes i.e. changes in the 'status'
    useEffect(()=>{
        console.log(`[useEffect] The restaurant is ${status?"Open":"Closed"}`)
    },[status]);

    return (
        // toggle will flip the status between 'true' and 'false'
        <>
            <h5>Parent Component/Restaurant Status {status?"Open":"Closed"}</h5>
            <button onClick={toggle}>
                {status? "Close" : "Open"} All Restaurant
            </button>

            <RestaurantStatus openStatus={status} onStatus={toggle}/>

            <Header name="Ally" school="AU/CSSE" year={new Date().getFullYear()}/>
            {/*<PrintNumber numList={items}/>*/}
            <ImageRender image={image1} title={"Photo of a Smiling Student"}/>
            <Dish dishObjs={dishObjects}/>
        </>
    );

}

export default App
