const { log } = console;

let groupID = {};
let groupUsers = {};

const groupServices = (socket) =>{
    socket.on("joinRoom", ({roomName, userID}) => {
        // groupServices(socket , roomName)
        log(roomName, "newIDuser", userID , "boss");
        // joinRoom(socket, roomName);
      });
    // socket.on("userDetails", ({id, username})=>{
    //     groupID[id] = socket.id
    //     groupUsers[id] = username
    // })

    // log(groupID, "id card")
    // log("roomname:" , roomName)
}

module.exports = { groupServices }