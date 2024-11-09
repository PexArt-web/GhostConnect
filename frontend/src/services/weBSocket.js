import io from "socket.io-client";

const socket = io("http://localhost:4000");

export const connectWeBSocket = () => {
  socket.on("connect", () => {
    console.log("Connected to the server");
  });
};

export { socket };
