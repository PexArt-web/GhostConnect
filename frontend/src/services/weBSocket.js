import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export function connectSocket() {
  socket.on("connection", () => {
    console.log("Connected to the server");
  });
};

export { socket };
