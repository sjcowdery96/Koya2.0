//using javascript to save my brain

const { createServer } = require('http')
const { Server } = require("socket.io")

const httpSever = createServer()
const io = new Server(httpSever, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

let mySampleData = 0;

io.on("connection", async (socket) => {
    console.log("New Socket! " + socket.id)
    //fires data on new socket connected
    io.to(socket.id).emit("someEvent", mySampleData)
    //recieve buttonClicked event from the client
    socket.on("buttonClicked", (data) => {
        console.log("recieved buttonClicked event from client! message:" + data.message)
        //increment sample data
        mySampleData++;
        console.log("SampleData: " + mySampleData)
        //send data back to ALL clients except sender
        //socket.broadcast.emit("someEvent", mySampleData)
        //sends to all clients INCLUDING sender
        io.emit("someEvent", mySampleData)
    })
    socket.on('disconnect', () => {
        console.log("discconnected and removed all listeners for socket: " + socket.id)
        socket.removeAllListeners();
    });
})

httpSever.listen(5003, () => {
    console.log("Websocket listening on port 5003")
})