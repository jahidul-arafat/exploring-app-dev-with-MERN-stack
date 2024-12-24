/*
Why socket.io, why not websockets
1. Automatic reconnection: Socket.IO handles reconnections automatically if the connection is lost.
2. Room support: It provides built-in support for rooms, making it easier to manage groups of connections.
3. Fallback support: If WebSocket isn't available, Socket.IO can fall back to other methods like long-polling.
4. Event-based communication: Socket.IO uses a more intuitive event-based model for sending and receiving messages.
5. Namespaces: It allows you to separate concerns within your application using namespaces.
6. Built-in broadcasting: Socket.IO has built-in methods for broadcasting messages to multiple clients.
 */

// Import required modules
import {Server} from "socket.io"; // socket.io is a framework for websocket
import {createServer} from "http";
import express from "express";
import {v4 as uuidv4} from 'uuid';

// create a new express application object
const app=express();
const httpServer=createServer(app); // attach the express App to httpServer
//const wss=new WebSocketServer({server: httpServer});
const socketIOServer =new Server(httpServer);


// serve the static file i.e. the app will serve ./public/bk_index.html as the application root "/"
app.use("/",express.static("./public",{
    index: "index.html"
}));

// Keep track of connected clients
const clients= new Map();


/*
Difference between io.emit() and socket.broadcast.emit()
=========================================================
1. io.emit():
    - Sends a message to all connected clients, including the sender.
    - Used when you want to broadcast a message to everyone.
2. socket.broadcast.emit():
    - Sends a message to all connected clients except the sender.
    - Used when you want to send a message to everyone but the client who triggered the event.
 */

// Handle Socket connection
socketIOServer.on("connection",(currentClientSocketConnection)=>{
    console.log(`Total ${socketIOServer.engine.clientsCount} connected to the server`);
    const clientId =uuidv4(); // Generate a unique ID for this client
    clients.set(currentClientSocketConnection.id,clientId); // <key,value>

    console.log(`New Socket.IO connection: Client ${clientId}`);

    // Send a welcome message to the new client
    currentClientSocketConnection.emit("welcome",{
        message: `Welcome to the Socket.IO server! Your clientID is ${clientId}`,
        clientId: clientId
    });

    // Broadcast new client connection to all other clients
    currentClientSocketConnection.broadcast.emit("newClient",{
        message: `Client ${clientId} has joined the chat`,
        clientId: clientId
    });

    // handle incoming messages from a client and broadcast to all other's chatbox
    currentClientSocketConnection.on("message",(message)=>{
        console.log(`Received message from ${clientId}: ${message}`);

        // broadcast the message to all connected clients excluding the sender client
        currentClientSocketConnection.broadcast.emit("message",{
            message: message.toString(),
            clientId: clientId
        });

    });

    // handle client disconnection
    currentClientSocketConnection.on("disconnect",()=>{
        console.log(`WebSocket connection closed: Client ${clientId}, current connections: ${socketIOServer.engine.clientsCount} remaining`);
        clients.delete(currentClientSocketConnection.id);

        // Broadcast client disconnection to all remaining clients
        currentClientSocketConnection.broadcast.emit("clientDisconnected",{
            message:`Client ${clientId} has disconnected`,
            clientId: clientId
        });

    });

})


// Start the httpserver
httpServer.listen(3000, () => {
    console.log("HTTP server is running at http://localhost:3000/");
});