const mongoose = require('mongoose')
const messageSchema = require("../Schema/messageSchema")
const Message = mongoose.model('Message', messageSchema)

module.exports = Message;