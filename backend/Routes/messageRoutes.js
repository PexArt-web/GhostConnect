const express = require('express');
const router = express.Router()
const { groupMessage } = require('../Controller/messageController');
// const requireAuth = require('../Middleware/requireAuth');

// Endpoint to get all users
// requireAuth()
router.get('/groupMessage', groupMessage)

module.exports = router