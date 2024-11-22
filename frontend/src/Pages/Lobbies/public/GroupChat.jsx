import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { clientSocket, socket } from "@/services/weBSocket";
import SharedButton from "@/shared/component/SharedButton";
import SharedInput from "@/shared/component/SharedInput";
import { useEffect, useState } from "react";
import { FiSend, FiUsers } from "react-icons/fi";

const GroupChat = () => {
  requireAuth();
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [users, setUsers] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const { username } = user;

  // creating userId to use as keys for socketID cause it doesn't change on every request or refresh using this to get real count value
  let userID = localStorage.getItem("userID");
  if (!userID) {
    userID = `user-${Date.now()}`;
    localStorage.setItem("userID", userID);
  }
  useEffect(() => {
    clientSocket();
    socket.on("connect", () => {
      //<--Emitting / sending User Details -->//
      const userDetails = { id: userID, username: username };
      socket.emit("userDetails", userDetails);
      //<-- broadcast roomJoining to whole room -->
      socket.emit("joinRoom", "GhostConnect");
      //
    });

    //<--Receiving User Details -->//
    socket.on("userRecords", ({ userCount, userList }) => {
      setOnlineUsersCount(userCount);
      setUsers(userList);
    });

    //<-- broadcast roomLeaving -->
    // socket.emit("leaveRoom", "GhostConnect");
    //<-- socket disconnection -->
    socket.on("disconnect", () => {
      localStorage.removeItem("userID");
      socket.on("userRecords", ({ userCount, userList }) => {
        setOnlineUsersCount(userCount);
        setUsers(userList);
      });
    });

    // Cleanup on component unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("userRecords");
    };
  }, [userID, username]);

  ``;
  const [messages, setMessages] = useState([
    // Example messages
    { sender: "Alice", content: "Hey everyone!" },
    { sender: "Bola", content: "Hello! How's it going?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Handle sending a message
  const handleSendMessage = () => {
    alert("sent");
    setMessages("Hello! ");
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    e.key === "Enter" && handleSendMessage();
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
          {onlineUsersCount === 1
            ? "Just You Online"
            : `${onlineUsersCount} members online`}
        </div>
      </div>

      {/* Online Members List */}
      <div className="flex overflow-x-auto p-4 bg-gray-800 space-x-4">
        {Object.entries(users).map(([id, username]) => (
          <div key={id} className="flex flex-col items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-300 mt-1">
              {id === userID ? "You" : username}
            </span>
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
        <SharedInput
          type={"text"}
          value={newMessage}
          onChange={handleChange}
          placeholder={"Type a message..."}
          className={
            "flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
          }
          onkeydown={handleKeyDown}
        />
        <SharedButton
          className={"text-blue-400 text-2xl ml-2"}
          handleClick={handleSendMessage}
          label={<FiSend />}
        />
      </div>
    </div>
  );
};

export default GroupChat;
