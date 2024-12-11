import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { useState } from "react";
import { FiPlusCircle, FiSend } from "react-icons/fi";

const MainGroupChat = () => {
  requireAuth()
  const selectedUserData = {
    id: 1,
    name: "Alice",
    avatar: "https://via.placeholder.com/40",
  };

  const [messages, setMessages] = useState([
 
    { sender: "user", content: "Hey, how's it going?" },
    { sender: "selectedUser", content: "I'm good, thanks! How about you?" },
  ]);
  const [newMessage, setNewMessage] = useState("");


  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "user", content: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center p-4 bg-gray-800 shadow-lg">
        <img
          src={selectedUserData.avatar}
          alt={`${selectedUserData.name}'s avatar`}
          className="w-10 h-10 rounded-full mr-4 border-2 border-green-500"
        />
        <h2 className="text-xl font-semibold">{selectedUserData.name}</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Area */}
      <div className="p-4 bg-gray-800 flex items-center">
        <button className="text-blue-400 text-2xl mr-2">
          <FiPlusCircle />
        </button>
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

export default MainGroupChat;
