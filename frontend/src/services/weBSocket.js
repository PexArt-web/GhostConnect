import { io } from "socket.io-client";

let socket;
export function clientSocket() {
  if (!socket) {
    socket = io("http://localhost:4000");
  }
  
}

export { socket };
