require("dotenv").config();
const { log } = console;
const express = require("express");
const { connectDB } = require("../Config/database");
const userRoutes = require("../Routes/userRoutes");
const messageRoutes = require("../Routes/messageRoutes");
const morgan = require("morgan");
const cors = require("cors");
const { connectSocket } = require("../Services/weBSocket");
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});
// Database and Server configuration
connectDB((error) => {
  if (!error) {
    const server = app.listen(port, () => {
      log(`database and server started at port  + ${port}`);
    });
    // weBSocket Connection
    const io = require("socket.io")(server, {
      cors: {
        origin: ["http://localhost:5173"],
        // methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => connectSocket(socket, io));
    //
    return;
  } else {
    log(`Error connecting to database:, ${error}`);
  }
});
