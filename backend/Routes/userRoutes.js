const express = require("express");
const { signupUser, loginUser, friendRequestList, friendList } = require("../Controller/userController");
const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.get("/friendRequestList", friendRequestList);

router.get("/friendList", friendList);


module.exports = router;
