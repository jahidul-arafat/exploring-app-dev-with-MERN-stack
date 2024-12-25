import logUpdate from 'log-update';

class PromiseQueue {
    constructor(promises, concurrentCount=1) {
        this.promises = promises;
        this.concurrentCount = concurrentCount;
        this.running = 0;
        this.results = [];
        this.index = 0;
        this.resolveQueue = null;
        this.rejectQueue = null;
        this.todo = [...Array(promises.length).keys()];
        this.inProgress = [];
        this.completed = [];
        this.startTime = 0; // Add this line
    }

    async run() {
        this.startTime = Date.now(); // Add this line
        return new Promise((resolve, reject) => {
            this.resolveQueue = resolve;
            this.rejectQueue = reject;
            this.processNext();
        });
    }

    processNext() {
        this.graphTasks();
        if (this.index === this.promises.length && this.running === 0) {
            this.graphTasks();
            const completionTime = (Date.now() - this.startTime) / 1000; // Add this line
            console.log(`\nTotal completion time: ${completionTime.toFixed(2)} seconds`); // Add this line
            this.resolveQueue(this.results);
            return;
        }

        while (this.running < this.concurrentCount && this.index < this.promises.length) {
            const currentIndex = this.index;
            this.inProgress.push(currentIndex);
            this.todo.shift();
            this.promises[this.index]()
                .then(result => {
                    this.results[currentIndex] = result;
                    this.running--;
                    this.inProgress = this.inProgress.filter(i => i !== currentIndex);
                    this.completed.push(currentIndex);
                    this.processNext();
                })
                .catch(error => {
                    this.rejectQueue(error);
                });

            this.running++;
            this.index++;
        }
        this.graphTasks();
    }

    graphTasks() {
        const graph = `
Todo: [${this.todo.join(', ')}]
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