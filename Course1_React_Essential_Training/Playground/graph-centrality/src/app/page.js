import {degreeCentrality} from './utils/centrality'

export default async function GET() {
    // populate some graph using object {}
    const graph = {
        A: ['B', 'C', 'D'],
        B: ['A', 'D', 'E'],
        C: ['A', 'D'],
        D: ['A', 'B', 'C', 'E'],
        E: ['B', 'D']
    };

    // since the Promises coudl reject, thus erro could trigger
    // thats why use try...catch
    let dCentrality;
    try {
        dCentrality = await degreeCentrality(graph);
    } catch (error) {
        dCentrality = {error: error.message}
    }
    console.log("Centrality Object:", JSON.stringify(dCentrality, null, 2));

    return (

        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16
            sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1>The Graph Centrality project</h1>
                <pre>{JSON.stringify(dCentrality, null, 2)}</pre>
            </main>
        </div>

    );
}
