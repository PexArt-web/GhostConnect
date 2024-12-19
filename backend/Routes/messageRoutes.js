const express = require("express");
const router = express.Router();
const { groupMessage } = require("../Controller/messageController");
const requireAuth = require("../Middleware/requireAuth");

router.use(requireAuth);

router.get("/groupMessage", groupMessage);

module.exports = router;
