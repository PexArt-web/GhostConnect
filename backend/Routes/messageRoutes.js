const express = require('express');
const router = express.Router()
const { groupMessage } = require('../Controller/messageController');

// Endpoint to get all users
router.get('/groupMessage', groupMessage)

module.exports = router