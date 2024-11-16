let connectedSocket = new Set()

function connectSocket(socket, io){
  io.emit("welcome", "hello world")

  socket.on("username", (data)=>{
    console.log(data)
  })
}

module.exports = {connectSocket}
