import HotelBlock from "./HotelBlock";

// what if you want a hybrid model, interactive approach to have both the server-side and client-side components

// Loading dynamic data from REST Api
// fetch the data from API - must be async
async function getData(){
    // will return a promise
    const data= await fetch(
        "https://snowtooth-hotel-api.fly.dev"
    );
    return data.json(); // this is a promise, not actual data
}


// Main component
// Default this is a server-side component
export default async function Page() {
    // fetch the data
    const data = await getData();
    return (
        <main>
            <div>
                <h1>The Hotels</h1>
                <div>{JSON.stringify(data,null,2)}</div>
                <div>
                    {data.map((hotelData)=>
                        <HotelBlock
                            key={hotelData.id}
                            hotel={hotelData}/> // calling the child component with 'Props'
                    )}
                </div>
            </div>
        </main>
    )
}