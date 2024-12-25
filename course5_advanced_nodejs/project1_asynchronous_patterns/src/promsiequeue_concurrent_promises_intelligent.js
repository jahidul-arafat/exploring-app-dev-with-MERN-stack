import logUpdate from 'log-update';

class PromiseQueue {
    constructor(promises, concurrentCount = 1) {
        this.promises = promises.map((p, index) => ({ index, promise: p, delay: this.getDelay(p) }))
            .sort((a, b) => a.delay - b.delay);  // Pre-sort promises
        this.concurrentCount = concurrentCount;
        this.running = 0;
        this.results = [];
        this.orderedResults = []; // New array for ordered results
        this.resolveQueue = null;
        this.rejectQueue = null;
        this.todo = this.promises.slice();
        this.inProgress = [];
        this.completed = [];
        this.startTime = 0;
    }

    getDelay(promiseFunc) {
        const funcString = promiseFunc.toString();
        const match = funcString.match(/delay\((\d+)\)/);
        return match ? parseInt(match[1]) : Infinity;
    }

    async run() {
        this.startTime = Date.now();
        return new Promise((resolve, reject) => {
            this.resolveQueue = resolve;
            this.rejectQueue = reject;
            this.processNext();
        });
    }

    processNext() {
        this.graphTasks();
        if (this.todo.length === 0 && this.running === 0) {
            this.graphTasks();
            const completionTime = (Date.now() - this.startTime) / 1000;
            console.log(`\nTotal completion time: ${completionTime.toFixed(2)} seconds`);
            this.resolveQueue(this.orderedResults); // Resolve with orderedResults
            return;
        }

        while (this.running < this.concurrentCount && this.todo.length > 0) {
            const { index, promise } = this.todo.shift();

            this.inProgress.push(index);
            this.running++;

            promise()
                .then(result => {
                    this.results[index] = result;
                    this.orderedResults.push(result); // Add result to orderedResults
                    this.running--;
                    this.inProgress = this.inProgress.filter(i => i !== index);
                    this.completed.push(index);
                    this.processNext();
                })
                .catch(error => {
                    this.rejectQueue(error);
                });
        }
        this.graphTasks();
    }

    graphTasks() {
        const graph = `
Todo: [${this.todo.map(p => p.index).join(', ')}]
Running: [${this.inProgress.join(', ')}]
Completed: [${this.completed.join(', ')}]
        `;
        logUpdate(graph);
    }
}

// Example usage:
const delay = (ms) => new Promise(resolve => setTimeout(() => {
    resolve(`Delayed ${ms}ms`);
}, ms));

const delayPromises = [
    () => delay(1000),
    () => delay(2000),
    () => delay(3000),
    () => delay(4000),
    () => delay(5000),
    () => delay(6000),
    () => delay(7000),
    () => delay(8000),
    () => delay(500),
    () => delay(600),
    () => delay(700),
    () => delay(8000),
    () => delay(7000),
];

async function runQueue() {
    const queue = new PromiseQueue(delayPromises, 4);
    try {
        const results = await queue.run();
        console.log('\nAll promises completed:', results);
    } catch (error) {
        console.error('\nAn error occurred:', error);
    }
}

runQueue();