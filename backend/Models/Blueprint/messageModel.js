const mongoose = require('mongoose')
const messageSchema = require("../Schema/messageSchema")
const Message = mongoose.model("GroupMessage", messageSchema)

module.exports = Message;