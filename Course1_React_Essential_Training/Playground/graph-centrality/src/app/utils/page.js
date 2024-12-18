import bfs from './bfs'

export default function SIMULATEBFS() {
    // Sample graph
    const graph = {
        A: ['B', 'C'],
        B: ['A', 'D', 'E'],
        C: ['A', 'F'],
        D: ['B'],
        E: ['B', 'F'],
        F: ['C', 'E']
    };

    let distances;
    try {
        // perform BFS starting from node 'A'
        distances = bfs(graph, 'A');
    } catch (error) {
        distances = {error: error.message};
    }

    console.log("BFS Result: ", JSON.stringify(distances, null, 2));

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16
            sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1>The Graph Centrality project [BFS]</h1>
                <pre>{JSON.stringify(distances, null, 2)}</pre>
            </main>
        </div>

    );
}
