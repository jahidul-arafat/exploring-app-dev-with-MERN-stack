import {log} from "next/dist/server/typescript/utils.js";
import {console} from "next/dist/compiled/@edge-runtime/primitives/index.js";

export default function bfs(graph, start) {
    // ensure the graph is not empty
    if (!graph || Object.keys(graph).length === 0) {
        throw new Error("The graph is empty");
    }

    // ensure the start node exists in the graph
    if (!(start in graph)) {
        throw new Error(`Start node "${start}" does not exists in the graph`);
    }

    // If the graph is valid and start node exists
    // instilaize the graph BFS essentials
    // initialise the distace and queue; both should be objects {}
    // Even though the variable is declared with const, you can still modify the properties of the object or the elements of the array. What you cannot do is reassign the variable to a new object or array.

    const distances = {}; // an object
    const visited = {}; // an object
    const queue = [start]; // an array

    // set the initial distance of the start node and mark is visited
    distances[start] = 0;
    visited[start] = true;

    // Perform the BFS
    while(queue.length>0){
        console.log("Current Queue Status: ", queue);
        const currentNode=queue.shift(); // dequeue the first node
        console.log("Popped Node: ", currentNode);

        //explore its neighbors
        for(const neighbor of graph[currentNode]){
            console.log("Current Visited Status[Distance]:",distances);
            console.log("Current Visited Status[Visited]:",visited);
            console.log(`Exploring neighbor ${neighbor}`)
            if(!visited[neighbor]){
                visited[neighbor]=true; // mark the neighbor as visited
                distances[neighbor]=distances[currentNode]+1; // update the distance
                queue.push(neighbor); // enqueue the neighbor to explore its own neighbor node
            }
            console.log();
        }
        console.log();
    }
    return distances; // return the distance from the start node
}

