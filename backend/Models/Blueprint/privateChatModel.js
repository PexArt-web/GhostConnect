const mongoose = require('mongoose');
const chatSchema = require('../Schema/privateChatSchema');
const pc = mongoose.model("PrivateChat", chatSchema)

module.exports = pc