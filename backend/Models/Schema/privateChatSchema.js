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
    },
    edited: { 
        type: Boolean,
        default: false
    }
}, {timestamps : true})

module.exports = chatSchema