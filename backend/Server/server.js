require("dotenv").config();
const { log } = console;
const express = require("express");
const { onConnect } = require("../Services/weBSocket");
const { connectDB } = require("../Config/database");
const app = express();
const port = process.env.PORT || 4000;
// Database and Server configuration
const server = connectDB((error) => {
  if (!error) {
    app.listen(port, () => {
      log("database and server started at port " + port);
    });
    return;
  } else {
    log("Error connecting to database:", error);
    process.exit(1);
  }
});
// weBSocket Connection
const io = require("socket.io")(server);
io.on("connection", onConnect);
//
