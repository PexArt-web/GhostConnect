const express = require("express");
const { signupUser, loginUser, friendRequestList } = require("../Controller/userController");
const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.get("/friendRequestList", friendRequestList);


module.exports = router;
