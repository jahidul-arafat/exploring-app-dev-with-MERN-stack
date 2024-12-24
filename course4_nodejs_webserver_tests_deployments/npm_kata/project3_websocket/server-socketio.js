// import required modules
import {createServer} from "http";
import {Server} from "socket.io";

// declare properties
const httpServer=createServer().listen(3000);
const socketIOServer= new Server(httpServer);

// Keep track of connected clients
const connectedClients = new Set();

// handle connections
// Event listener for connection event whenever a client connects to the socket.io server
socketIOServer.on("connection",(currentClientSocketConnection)=>{
    connectedClients.add(currentClientSocketConnection.id);
    console.log(`New Client/Socket.IO connection: ${currentClientSocketConnection.id}`);
    console.log(`Total ${connectedClients.size} connected to the server`);

    // handle incoming message from a client
    currentClientSocketConnection.on("chat",(message)=>{
        console.log(`[From SocketIO Server]s${currentClientSocketConnection.id}: ${message}`);

        // broadcast the message to all the connected client's chatbox
        // socketio-client will listen for the "message" event on the client side
        socketIOServer.sockets.emit("message", message.toString(), currentClientSocketConnection.id);
    });

    // handle client disconnection
    // when a client disconnects from the server, we want to remove them from the list of connected clients
    currentClientSocketConnection.on("disconnect",()=>{
        connectedClients.delete(currentClientSocketConnection.id);
        console.log(`Disconnected ${currentClientSocketConnection.id}, current connections: ${connectedClients.size} remaining`);

    });
});

console.log("Socket Server started on port 3000");

// Next
// Build a CLI application that can connect to our socket.io application to send and receive message
