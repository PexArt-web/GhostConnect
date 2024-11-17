let connectedSocket = new Set()
let users = {}

function connectSocket(socket, io){
  //<--Active Users -->
  connectedSocket.add(socket.id)
  io.emit("activeUsers", connectedSocket.size)

  socket.on("userName", (username)=>{
    users[socket.id] = username
  })

  socket.emit("userList", users)
}

module.exports = {connectSocket}
