const mongoose = require('mongoose');
const Schema = mongoose.Schema

const chatSchema = new Schema({
    sender:{
        type: String
    },
    content : {
        type: String
    },
    senderID: {
        type: String
    },
    recipientId: {
        type: String
    }
}, {timestamps : true})

module.exports = chatSchema