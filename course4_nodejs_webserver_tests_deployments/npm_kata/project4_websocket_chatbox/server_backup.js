// This example will consist of a server that broadcasts messages to all connected clients, and a simple HTML client that can send and receive messages.
/*
WebSocket
===========
An WebSocket is full duplex and bidirectional- It starts with an HTTP connection that is then upgraded to a WebSocket connection.

Once established, both the client and server can send messages to each other at any time, without the need for the client to initiate each interaction.
The WebSocket connection remains open until either party closes it, allowing for real-time, two-way communication.

Key Differences between HTTP and WebSocket
1. Initiation: HTTP requires the client to initiate each interaction. WebSocket allows both client and server to initiate messages after the initial connection is established.
2. Connection Lifecycle: HTTP connections (even with keep-alive) are typically shorter-lived and may be closed after periods of inactivity. WebSocket connections are designed to stay open for extended periods.
3. Overhead: HTTP has more overhead due to headers being sent with each request. WebSocket has minimal overhead after the initial handshake.
4. Use Case: HTTP is ideal for traditional web content delivery. WebSocket is better for real-time, event-driven web applications.

In summary, while HTTP is not strictly unidirectional in data flow (data goes both ways), it is unidirectional in terms of who can initiate the communication.
WebSocket, on the other hand, is truly bidirectional, allowing both parties to initiate communication at any time after the connection is established.
*/
// Import required modules
import {WebSocketServer, WebSocket} from "ws"; // for handling websocket connect
                        // Websocket is a computer communication protocol that allows for two-way communication between a client and a server over a single conenction
                        // WebSockets establish a connection through a WebSocket handshake that uses the ws:// or wss:// URL schemes. The connection is then upgraded to the WebSocket protocol.
import {createServer} from "http"; // to create an HTTP server // attach both the Express app and Websocket server to the Http Server
                                    // to handle both the HTTP and WebScoket traffic to use the same port on the same server
import express from "express"; // for creating the Express applicaiton
import {v4 as uuidv4} from 'uuid'; // Import UUID to generate unique IDs

// create a new express application object
// express will help us to set routes, middleware and other server configuration
const app=express();
const httpServer=createServer(app); // attach the express App to httpServer
const wss=new WebSocketServer({server: httpServer});

// serve the static file i.e. the app will serve ./public/bk_index.html as the application root "/"
app.use("/",express.static("./public",{
    index: "bk_index.html"
}));

/*
Objective: This process ensures that when you send a message, it's broadcasted to all other connected clients, but not back to you.
It's a common pattern in chat applications or any real-time system where you want updates to be sent to all participants except the originator of the message.

Scenario:
1. You (Client A) and two other clients (Client B and Client C) are connected to the WebSocket server (WSS).
2. You (Client A) send a message to the WSS.
3. The WSS receives your message and then:
    - It logs the received message.
    - It starts a loop to go through all connected clients.
    - For each client, it checks if:
        a) The client is not you (the original sender)
        b) The client's connection is open
4. If both conditions are met, the WSS sends your message to that client.
5. In this case:
    - The message will be sent to Client B
    - The message will be sent to Client C
    - The message will NOT be sent back to you (Client A)
 */

// create a websocket
// callback (ws)-> when a client connects to the WebSocket server, this callback function will be triggered
wss.on("connection", (client_specific_ws_connection) => {
    console.log("New WebSocket connection");

    // ws- websocket connection is now ready to send and receive messages
    // send a welcome message to the new client
    client_specific_ws_connection.send("Welcome to the WebSocket server!");

    // Sets up an event listener for incoming messages from this specific client.
    // When a message is received, it logs the message.
    // handle incoming messages from the client
    client_specific_ws_connection.on("message", (message) => {
        console.log(`Received message: ${message}`);

        // broadcast the message to all connected clients
        // ws is the original sender's WebSocket connection, and we're comparing it against each client in the connected clients list to ensure we don't send the message back to the original sender.
        wss.clients.forEach((client) => {
            if (client !== client_specific_ws_connection && client.readyState === WebSocket.OPEN) {
                client.send(message); // wss sending the message to all connected clients except the original sender.
            }
        });
    });

    // handle client disconnection
    // disconnection of a client from the WebSocket server
    // The "close" event is emitted when the WebSocket connection is closed, either by the client or due to network issues.
    // If you want Client B and Client C to know when Client A disconnects, you would need to add code to broadcast a message to all remaining clients when a disconnection occurs. For example:
    client_specific_ws_connection.on("close", () => {
        console.log("WebSocket connection closed");
        wss.clients.forEach((client)=>{
            if (client.readyState===WebSocket.OPEN){
                client.send("A client has disconnected"); // wss broadcasting message to all alive client that "a client is disconnected"
            }
        })
    });
});


// Start the httpserver
/*
The reason for starting the httpServer instead of the Express app directly is due to the architecture of this application, which combines both HTTP and WebSocket protocols. Let's break it down:

1. Integrated HTTP and WebSocket Server: In this setup, we're running both an HTTP server (for serving static files and potentially other HTTP routes) and a WebSocket server on the same port. This is a common and efficient pattern for real-time web applications.
2. Express App Attached to HTTP Server: The Express app (app) is attached to the HTTP server (httpServer) using createServer(app). This means the Express app is handling HTTP requests through this HTTP server.
3. WebSocket Server Attached to HTTP Server: The WebSocket server (wss) is also attached to the same HTTP server using new WebSocket.Server({httpServer}).
4. Single Port for Both Protocols: By starting the httpServer, we're effectively starting both the HTTP and WebSocket servers on the same port (3000 in this case). This allows the application to handle both HTTP requests (through Express) and WebSocket connections on the same port.
5. Upgrade Mechanism: When a WebSocket connection is initiated, it starts as an HTTP request and then "upgrades" to a WebSocket connection. Having both servers on the same port facilitates this upgrade process.

// For this architecture, must not start the Express app server separately.
Note: If we had started the Express app directly (app.listen(3000, ...)), we would only be running an HTTP server, and the WebSocket server wouldn't be properly integrated.
This setup is more efficient and easier to manage, especially for applications that need both traditional HTTP functionality and real-time WebSocket communication.
 */
httpServer.listen(3000, () => {
    console.log("HTTP server is running at http://localhost:3000/");
});