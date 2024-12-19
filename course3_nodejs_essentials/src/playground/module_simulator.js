// list all node core modules
// path is a core module
console.log(require('module').builtinModules);
// import {builtinModules} from 'module';
// console.log(builtinModules);

// Node.js traditionally uses the CommonJS module system. In CommonJS, modules are loaded using the require() function.
const pathModule = require("path"); // import the node built-in module 'path'
const utilModule = require("util"); // to get the logs
const v8Module = require("v8"); // Node.js uses chrome's v8 interpretation
// get how much memory the app is using
// Node.js uses v8 to run JavaScript on the server-side

console.log(pathModule.basename(__filename)); // isolate the fullpath from the filename and only show the filename in console.

// using path.join()
const dirUploads = pathModule.join(
    __dirname,
    "www",
    "files",
    "uploads"
);
utilModule.log(dirUploads);

// using 'util' module, it has a log method
utilModule.log(pathModule.basename(__filename));
utilModule.log(v8Module.getHeapStatistics()); // how much memory your app is using
                                            // Heap is a portion of memory used for dynamic memory allocation during program execution
                                            // its a large pool of memory with no particular structure
                                            // In JS, objects and varibales that aren't immediately destroyed are stored in heap
                                            // In JS, heap is managed by gurbage colletor
                                            // Heap memory Accessed through pointers or references.
                                            // Generally slower to access than stack memory, but faster than disk storage
// Why Node.js is using Heap Memory? Why not using Stack Memory?
/*
Great question! Let's dive into the differences between stack memory and heap memory, and why Node.js (and JavaScript in general) primarily uses heap memory for dynamic allocation.

Stack Memory:
1. Structure: Last-In-First-Out (LIFO) data structure.
2. Allocation: Memory is allocated/deallocated in a defined order.
3. Speed: Very fast access.
4. Size: Limited and usually smaller than heap.
5. Lifetime: Short-lived; variables are destroyed when they go out of scope.
6. Usage: Typically used for static memory allocation and thread execution space.
7. Data: Stores local variables, function parameters, and return addresses.

Heap Memory:
1. Structure: Large pool of memory with no particular order.
2. Allocation: Memory can be allocated and freed in any order.
3. Speed: Slower access compared to stack, but still faster than disk.
4. Size: Usually larger than stack.
5. Lifetime: Objects persist until explicitly deallocated or garbage collected.
6. Usage: Used for dynamic memory allocation.
7. Data: Stores objects, closures, and other complex data structures.

Why Node.js (and JavaScript) primarily use heap for dynamic memory allocation:

1. Object-Oriented Nature: JavaScript is heavily object-oriented, and objects are best suited for heap allocation due to their variable size and longer lifetimes.

2. Closures: JavaScript's closure mechanism, which allows functions to access variables from their outer scope, is more easily implemented using heap memory.

3. Garbage Collection: JavaScript uses automatic memory management through garbage collection, which is more efficiently implemented with heap memory.

4. Dynamic Typing: JavaScript's dynamic typing means that variable sizes can change at runtime, which is better handled by heap allocation.

5. Asynchronous Nature: Node.js's event-driven, non-blocking I/O model often requires data to persist across multiple asynchronous operations, which is better suited to heap memory.

6. Large Data Structures: For handling large amounts of data or complex data structures, heap memory is more suitable as it's not constrained by the typically smaller stack size.

7. Flexibility: Heap allocation provides more flexibility for memory management, which is crucial for the dynamic nature of JavaScript applications.

8. V8 Engine Design: The V8 engine, which Node.js uses, is optimized for managing heap memory efficiently for JavaScript execution.

While stack memory is used in Node.js (for example, for managing the call stack), the majority of dynamic memory allocation that you'll work with as a developer occurs in the heap. This design choice aligns well with JavaScript's programming model and the typical use cases of Node.js applications, which often involve handling complex data structures, maintaining state across asynchronous operations, and dealing with varying amounts of data.

It's worth noting that modern JavaScript engines like V8 employ sophisticated optimization techniques to make heap memory management as efficient as possible, mitigating many of the traditional performance drawbacks associated with heap allocation.
 */