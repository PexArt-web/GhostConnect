const express = require("express");
const { signup, login } = require("../Controller/userController");
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
