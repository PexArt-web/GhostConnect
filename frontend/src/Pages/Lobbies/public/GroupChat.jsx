import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { connectSocket, socket } from "@/services/weBSocket";
import { useState } from "react";
import { FiSend, FiUsers } from "react-icons/fi";

const GroupChat = () => {
  requireAuth();
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [userName, setUserName] = useState("");
  function weBSocket() {
    connectSocket();
    socket.on("connect", () => {
      console.log(socket.id, "groupchat socket id");
    });

    socket.on("clients-total", (clientsTotal) => {
      setOnlineUsersCount(clientsTotal);
      console.log(onlineUsersCount, "online users total")
    });

    socket.on("users-list", (usersList) => {
      console.log(usersList, "users list");
      setUserName(usersList)
      console.log(userName, "user name")
    });

    // socket.on("disconnect")
  }
  weBSocket();

  const groupMembersData = [
    { id: 1, name: "Alice", avatar: "https://via.placeholder.com/40" },
    { id: 2, name: "Bob", avatar: "https://via.placeholder.com/40" },
    { id: 3, name: "Charlie", avatar: "https://via.placeholder.com/40" },
  ];
``
  const [messages, setMessages] = useState([
    // Example messages
    { sender: "Alice", content: "Hey everyone!" },
    { sender: "Bola", content: "Hello! How's it going?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "You", content: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 shadow-lg">
        <h2 className="text-xl font-semibold">
          Welcome To the Invisible Connect
        </h2>
        <div className="flex items-center text-sm text-gray-400">
          <FiUsers className="mr-2" />
          {groupMembersData.length} members online
        </div>
      </div>

      {/* Online Members List */}
      <div className="flex overflow-x-auto p-4 bg-gray-800 space-x-4">
        {groupMembersData.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            <img
              src={member.avatar}
              alt={`${member.name}'s avatar`}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <span className="text-xs text-gray-300 mt-1">{member.name}</span>
          </div>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div
              className={`${
                message.sender === "You" ? "text-blue-400" : "text-green-400"
              } font-semibold`}
            >
              {message.sender}
            </div>
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.sender === "You"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-800 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="text-blue-400 text-2xl ml-2"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
