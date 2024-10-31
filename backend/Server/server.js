require("dotenv").config();
const { log } = console;
const express = require("express");
const { onConnect } = require("../Services/weBSocket");
const app = express();
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  log("server started at port " + port);
});
// weBSocket Connection
const io = require("socket.io")(server);
io.on("connection", onConnect);
// 