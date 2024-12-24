import {WebSocketServer, WebSocket} from "ws";

const wss = new WebSocketServer({ port: 3000 });

// create a new array of message to populate in chat
let messages=[];

// create a websocket
// callback (ws)-> when a client connects to the WebSocket server, this callback function will be triggered
wss.on("connection", (currentClientWSConnection) => {
    console.log("New WebSocket connection");

    // send a welcome message to the currentClientWSConnection
    currentClientWSConnection.send("Welcome to Live Chat");

    // if a client restarted, then populate the chat with earlier messages to avoid message lost
    if (messages.length){
        currentClientWSConnection.send("Chat currently in session");
        messages.forEach(message=>currentClientWSConnection.send(message.toString()));
    }

    // handle incoming message from a client
    currentClientWSConnection.on("message",(message)=>{
        console.log(message.toString());
        messages.push(message.toString());
        if (message.toString()==="exit"){
            currentClientWSConnection.close();
        } else{
            // broadcast the message to all the connected client
            wss.clients.forEach((client)=>{
                client.send(message.toString());
            })
        }
    })
    // handle client disconnection
    currentClientWSConnection.on("close", () => {
        console.log("WebSocket connection closed")
    });
});

console.log("Chat server waiting for connection on ws://localhost:3000/");