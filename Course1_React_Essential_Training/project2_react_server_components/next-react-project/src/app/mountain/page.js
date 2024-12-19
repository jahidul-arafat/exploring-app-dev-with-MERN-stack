// lets fetch some data from a REST Api - must be asynchronous
// Note: fetching data from API is asynchronous
// getData() returns a Promise, not the actual data.
// so, to get the actual data upon return, we must use await getData() at Page()
async function getData(){
    const response=await fetch("https://snowtooth-api-rest.fly.dev"); // this 'fetch() is not a raw JS fetch, its a next.js wrapper around fetch'
    return response.json(); // transform the response into a JSON string
                            // NEXT- we will fetch this data directly on the page
}

// Page is an sync server component
// so we are fetchign data at server component, not at client component
// In Next.js, pages are server component by default. Means they run on the server and send the rendered HTML to the client
// the getData() fetched the data at the server before the component is rendered
// What are the sign of client side data fetching? - useState, useEfflect hook; if used, then probably a client side componenet
/*

This approach of fetching data in server components has several advantages:
    - Improved initial page load performance
    - Better SEO as the content is ready when the page is served
    - Reduced client-side JavaScript bundle size
 */

export default async function Page() {
    const data =  await getData(); // must use 'await' to get the data, else getData() gonna return a Promise, not the data
    // in JSX, {} is used to embed JavaScript expressions. ANything inside these braces will be evaluated as JavaScript.
    return (
        <>
            <main>
                <h1>The mountain route</h1>
                {/*<div>{JSON.stringify(data,null,2)}</div>*/}
                <table>
                    <thead>
                        <tr>
                            <th>Lift Name</th>
                            <th>Current Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(
                            (lift)=>(
                            <tr key={lift.id}>
                                <td>{lift.name}</td>
                                <td>{lift.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </>

    )
}