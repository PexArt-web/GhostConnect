import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import SharedAvatar from "@/shared/component/SharedAvatar";
import SharedButton from "@/shared/component/SharedButton";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate, useOutletContext } from "react-router-dom";

const ChatLobby = () => {
  requireAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const { onlineUsers, users, userID } = useOutletContext();

  const handleClick = () => {
    navigate("/lobby-layout/private-chat");
  };

  const handleUSerSelect = (id, username) => {
    setSelectedUser({ id, username });
    // Store selected user in local storage for later use
    const userDetails = JSON.stringify({recipientID: id, recipientName: username})
    localStorage.setItem('selectedUser', userDetails);
    console.log(userID, "userID", id , "selectedUserID");

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white px-6">
      <h1 className="text-3xl font-semibold mb-4">Start a Private Chat</h1>
      <p className="text-gray-300 mb-8 text-center">
        Select someone to chat with. You`ll be connected privately for a 1-on-1
        conversation.
      </p>

      {/* Online Users to Select */}
      <div className="w-full max-w-lg bg-gray-700 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Available Users ({onlineUsers})
        </h2>
        <div className="flex flex-wrap gap-4">
          {Object.entries(users).map(([id, username]) => (
            <div
              key={id}
              onClick={() => handleUSerSelect(id, username)}
              className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg ${
                id === userID ? "bg-blue-600" : "bg-gray-800"
              } hover:bg-blue-500 transition duration-200`}
            >
              <SharedAvatar
                className={"w-10 h-10 rounded-full border-2 border-blue-500"}
                alt={`${username}'s Avatar`}
              />

              <span className="text-gray-200 font-medium">{username}</span>
              <FiPlus className="text-green-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Selected User Display */}
      {selectedUser && (
        <div className="w-full max-w-xs bg-gray-800 rounded-lg p-4 shadow-lg mb-8 text-center">
          <h3 className="text-lg font-semibold">You selected:</h3>
          <div className="flex flex-col items-center mt-4">
            <SharedAvatar
              alt={`${selectedUser.username}`}
              className={
                "w-16 h-16 rounded-full border-2 border-green-500 mb-2"
              }
            />
            <span className="text-white font-medium">
              {selectedUser.username}
            </span>
          </div>
        </div>
      )}

      {/* Start Private Chat Button */}
      <SharedButton
        className={
          "w-full max-w-xs py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        }
        handleClick={handleClick}
        disabled={!selectedUser}
        label={"Start Private Chat ➔"}
      />
    </div>
  );
};

export default ChatLobby;
