import bfs from './bfs'; // bfs will be used for closeness centrality scoring

// Degree Centrality
async function calculateDegreeCentrality(graph){
    return new Promise((resolve,reject)=>{
        // create a object called 'centrality'
        const centrality={};

        // check if the graph is empty
        // if graph is empty, then callback to the reject and return
        if(Object.keys(graph).length===0){
            reject(new Error("The graph is empty"));
            return;
        }

        // if the graph is not empty
        // iterate over each node of the graph
        for(const node in graph){
            // validate the struture of the graph
            // check if each node in the graph has an array of neighbors
            // i.e. if the graph[node] is not an array (i.e. undefined, null or other types), then trying to access the length property will raise an error
            if(Array.isArray(graph[node])){
                // the degree of the node is the number of its neighbors
                centrality[node]=graph[node].length
            } else{
                reject(new Error(`Invalid graph structure for the node ${node}`));
                return;
            }

        }

        // callback to the resolve function to resolve the promise with calculuated degree of centrality
        resolve(centrality)
    });
}

// create an alias of the function 'calculateDegreeCentrality' and export it as 'degreeCentrality'
export const degreeCentrality = calculateDegreeCentrality;

// Closeness Centrality
function calculateClosenessCentrality(graph){
    return new Promise((resolve,reject)=>
        {
            // write all the sync code here
            // create an object called 'centrality'
            const centrality={};

            // check if the graph is empty or not
            // return with reject if empty
            const nodes=Object.keys(graph);
            if (nodes.length===0){
                reject(new Error("The graph is empty, having no node"));
                return;
            }

            // if not empty, then resolve the promise with centrality score


        }
    );
}