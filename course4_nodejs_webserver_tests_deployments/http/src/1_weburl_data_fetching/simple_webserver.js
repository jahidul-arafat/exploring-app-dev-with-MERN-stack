// import modules
const {createServer} = require("http");

// define the server
createServer((req, res) => {
    // server's response to a client request.
    res.writeHead(200, {'Content-Type': 'text/plain'});   // server setting up the response headers.
    res.end('Hello World!\n'); // server sending the response body to the client.
}).listen(3000, () => {
    console.log('Server is running at http://localhost:3000/');
})