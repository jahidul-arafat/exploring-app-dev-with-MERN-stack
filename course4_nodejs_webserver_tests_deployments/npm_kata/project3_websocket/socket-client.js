// A CLI application to send and receive messages through socket.io
import { io as socketIOClient } from "socket.io-client";
import readline from 'readline';

const SERVER_URL = "http://localhost:3000";

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// Create a listener for this CLI application
const socketioServerListener = socketIOClient(SERVER_URL, {
    reconnectionAttempts: 5,
    timeout: 10000
});

// When the client successfully connects to the server
socketioServerListener.on("connect", () => {
    console.log("Connected to the server. Type your messages or 'exit' to quit.");
    promptUser();
});

// Handle reconnection attempts
socketioServerListener.on("reconnect_attempt", (attemptNumber) => {
    console.log(`Attempting to reconnect... (Attempt ${attemptNumber})`);
});

// Handle successful reconnection
socketioServerListener.on("reconnect", () => {
    console.log("Reconnected to the server.");
});

// Handle failed reconnection
socketioServerListener.on("reconnect_failed", () => {
    console.error("Failed to reconnect to the server. Please check your connection and try again later.");
    process.exit(1);
});

// Set up a listener for incoming "message" events from the server
socketioServerListener.on("message", (message, clientID) => {
    console.log(`\n[client ${clientID}]: ${message}`);
    promptUser();
});

// Handle disconnection
socketioServerListener.on("disconnect", (reason) => {
    console.log(`Disconnected from the server. Reason: ${reason}`);
});

// Handle errors
socketioServerListener.on("error", (error) => {
    console.error("Connection error:", error);
});

// Promisify the readline question method
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Function to prompt the user for input
async function promptUser() {
    try {
        const input = await question("> ");
        const message = input.trim();

        if (message.toLowerCase() === "exit") {
            console.log("Disconnecting from the server...");
            socketioServerListener.disconnect();
            rl.close();
            process.exit(0);
        } else if (message) {
            socketioServerListener.emit("chat", message);
        }

        promptUser();
    } catch (error) {
        console.error("Error reading input:", error);
        promptUser();
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log("\nDisconnecting from the server...");
    socketioServerListener.disconnect();
    rl.close();
    process.exit(0);
});