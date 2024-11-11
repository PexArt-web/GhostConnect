import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:4000");
  }
};

export { socket };
