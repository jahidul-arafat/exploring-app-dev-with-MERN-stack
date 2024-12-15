import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Lets try to destructure an array
// create an array of animals
// array destructuring
// const [, secondAnimal, ] =
//     ["dog", "cat", "cow"];
// console.log("Animals: ", secondAnimal);

// Go find this element 'root' and render this component
createRoot(document.getElementById('root')).render(<App/>);
