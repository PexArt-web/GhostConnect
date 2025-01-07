const express = require("express");
const router = express.Router();
const { groupMessage, getChats } = require("../Controller/messageController");
const requireAuth = require("../Middleware/requireAuth");

// router.use(requireAuth);

router.get("/groupMessage", groupMessage);
router.get("/private_chats", getChats)
module.exports = router;
