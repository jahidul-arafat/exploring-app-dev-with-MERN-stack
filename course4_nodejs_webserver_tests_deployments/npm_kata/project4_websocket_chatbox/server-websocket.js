// Import required modules
import {WebSocketServer, WebSocket} from "ws";
import {createServer} from "http";
import express from "express";
import {v4 as uuidv4} from 'uuid';

// create a new express application object
const app=express();
const httpServer=createServer(app); // attach the express App to httpServer
const wss=new WebSocketServer({server: httpServer});

// serve the static file i.e. the app will serve ./public/bk_index.html as the application root "/"
app.use("/",express.static("./public",{
    index: "bk_index.html"
}));

// Keep track of connected clients
const clients= new Map();

// create a websocket
// callback (ws)-> when a client connects to the WebSocket server, this callback function will be triggered
wss.on("connection", (currentClientWSConnection) => {
    const clientId =uuidv4(); // Generate a unique ID for this client
    clients.set(currentClientWSConnection,clientId); // <key,value>

    console.log(`New WebSocket connection: Client ${clientId}`);

    currentClientWSConnection.send(JSON.stringify(
        {
            type:'welcome',
            message: `Welcome to the WebSocket server! Your clientID is ${clientId}`,
            clientId: clientId
        }
    ));

    // Broadcast new client connection to all other clients
    broadcastMessage({
        type:'newClient',
        message: `Client ${clientId} has joined the chat`,
        clientId: clientId
    },currentClientWSConnection);


    // handle incoming messages from a client and broadcast to all other's chatbox
    currentClientWSConnection.on("message", (message) => {
        console.log(`Received message: ${message}`);

        // broadcast the message to all connected clients excluding the sender client
        broadcastMessage({
            type: 'message',
            message: message.toString(),
            clientId: clientId
        },currentClientWSConnection)
    });

    // handle client disconnection
    currentClientWSConnection.on("close", () => {
        console.log(`WebSocket connection closed: Client ${clientId}`);
        clients.delete(currentClientWSConnection);

        // Broadcast client disconnection to all remaining clients
        broadcastMessage({
            type:"clientDisconnected",
            message:`Client ${clientId} has disconnected`,
            clientId: clientId
        });
    });
});

function broadcastMessage(message,excludeClient=null){
    // broadcast the message to all connected clients
    wss.clients.forEach((client) => {
        if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message)); // wss sending the message to all connected clients except the original sender.
        }
    });
}


// Start the httpserver
httpServer.listen(3000, () => {
    console.log("HTTP server is running at http://localhost:3000/");
});