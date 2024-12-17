import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { clientSocket, socket } from "@/services/weBSocket";
import SharedButton from "@/shared/component/SharedButton";
import SharedInput from "@/shared/component/SharedInput";
import { useEffect, useState } from "react";
import { FiPlusCircle, FiSend } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

const MainGroupChat = () => {
  requireAuth();
  const selectedUserData = JSON.parse(localStorage.getItem("selectedUser"));
  const { userID } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  console.log(userID, "userID", selectedUserData.recipientID, "selectedUserID");

  useEffect(() => {
    clientSocket();
    socket.on("connect", () =>{
      console.log("Connected to websocket");
    });

    socket.on("newPrivateMessage", (messageData) => {
      console.log("New message", messageData);
   setMessages(prevMessages => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("connect");
      socket.off("newPrivateMessage");
    };
  }, []);

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        content: newMessage,
        recipientId: selectedUserData.recipientID,
        senderID: userID
      }
      socket.emit("sendMessage", (messageData));
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center p-4 bg-gray-800 shadow-lg">
        <img
          src={selectedUserData.avatar}
          alt={`${selectedUserData?.recipientName}'s avatar`}
          className="w-10 h-10 rounded-full mr-4 border-2 border-green-500"
        />
        <h2 className="text-xl font-semibold">
          {selectedUserData?.recipientName}
        </h2>
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
        <SharedButton
          className={"text-blue-400 text-2xl mr-2"}
          label={<FiPlusCircle />}
        />
        <SharedInput
          type={"text"}
          value={newMessage}
          onChange={handleChange}
          placeholder={"Type a message..."}
          className={
            "flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
          }
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        <SharedButton
          handleClick={handleSendMessage}
          className={"text-blue-400 text-2xl ml-2"}
          label={<FiSend />}
        />
      </div>
    </div>
  );
};

export default MainGroupChat;
