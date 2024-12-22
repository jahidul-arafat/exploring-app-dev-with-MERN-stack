// import modules
const {createServer} =require("http");
const {createReadStream}=require("fs"); // will pipeline the static contents into the response body made by sever for the client request



const sendFileAsResponse=(res,contentType,statusCode,fileToSendToClient)=>{
    res.writeHead(statusCode, {"Content-Type":contentType});
    createReadStream(fileToSendToClient).pipe(res); // the pipe() method is used here for efficient streaming of data from the file to the HTTP response
                                                // pipe() automatically handles backpressure. If the client is slow in receiving data, pipe() will pause reading from the file until the client is ready for more, preventing memory overflow.

    // // to write the file contents to client response without .pipe()
    // const fileStream = createReadStream(fileToSendToClient);
    // // always on- reading whenever data read
    // fileStream.on("data", (chunk)=>{
    //     res.write(chunk);
    // });
    //
    // fileStream.on("end",()=>{
    //     res.end();
    // })

}

const server= createServer((req,res)=>{
    switch(req.url){
        case "/": // if server received the url request of localhost:3000/ from client
            return sendFileAsResponse(
                res,
                "text/html",
                200,
                "../public/template/home-page.html"
            );
        case "/img/04.jpeg":
            return sendFileAsResponse(
                res,
                "image/jpg",
                200,
                "../public/img/04.jpeg"
            );
        case "/css/style.css":
            return sendFileAsResponse(
                res,
                "text/css",
                200,
                "../public/css/style.css"
            );
        default:
            return sendFileAsResponse(
                res,
                "text/html",
                404,
                "../public/template/404.html"
            );
    }
});

// start the server to listen to port 3000
server.listen(3000,()=>{
    console.log("Server started at port 3000");
});