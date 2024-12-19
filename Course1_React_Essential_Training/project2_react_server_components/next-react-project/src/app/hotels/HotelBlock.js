"use client"; // to mark it, its a client-side component;
                // why we maked this HotelBlock as a client component?
                // because we are dealing loading some local files from public/hotels
// else Next.js will try to use it as a server-side component and will render error
import Image from "next/image";  // library to load the image

// Child Component
// Create a Data Presentation Component
// based on the returned data, create a component named 'HotelBlock'
// {name, capacity} - object destructuring
// name - is a property from the 'data' we get from the API

// object destructuring {src} is used
// {src} is implicitly passed by Next.js when a loader is used in an image
function imageLoader({src}){
    console.log(`./hotels/${src}.jpeg`);
    return `./hotels/${src}.jpeg`; // reading the images from public/hotels
                                    // and also creating an API endpoint like localhost:3000/hotels/01.jpeg for each of the images
}

// object destructuring {hotel}
// By default all the React components are Server-side componets
// So, we need to make an adjustment that the HotelBlock is a client component
export default function HotelBlock({hotel}){
    console.log(hotel);

    // imageLoader will receive the whole image object and will destructuring the property {src}
    return(
        <div>
            <h2>{` ${hotel.id} ${hotel.name} (${hotel.capacity})`}</h2>

            <Image
                src={hotel.id}
                width={300}
                height={100}
                loader={imageLoader} alt={`image ${hotel.id}`}/>
        </div>
    )
}