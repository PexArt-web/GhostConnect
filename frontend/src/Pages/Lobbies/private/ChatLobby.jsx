import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { clientSocket, socket } from "@/services/weBSocket";
import SharedAlert from "@/shared/component/SharedAlert";
import SharedAvatar from "@/shared/component/SharedAvatar";
import SharedButton from "@/shared/component/SharedButton";
import SharedInput from "@/shared/component/SharedInput";
import { space } from "postcss/lib/list";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate, useOutletContext } from "react-router-dom";

const ChatLobby = () => {
  requireAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [requestNotification, setRequestNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { onlineUsers, users, userID } = useOutletContext();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    clientSocket();
    // socket.on("friendRequest", (requests) => {
    //   setRequestNotification(true);
    //   setFriendRequestList(requests);
    //   alert("a new friend request has been received + " + requests);
    //   console.log(requests, "requests");
    // });
    return () => {
      socket.off("friendRequest");
    };
  }, []);
  console.log("friendRequests", requestNotification);

  const handleUserSelect = (id, username) => {
    setSelectedUser({ id, username });
    const userDetails = JSON.stringify({
      recipientID: id,
      recipientName: username,
    });
    localStorage.setItem("selectedUser", userDetails);
  };
  console.log(selectedUser, "selectedUser");
  console.log(onlineUsers, "onlineUsers");
  const handleAddFriend = (id, username) => {
    if (!id || !username) return;
    socket.emit("sendFriendRequest", { id, username });
    // if (!friends.find((friend) => friend.id === id)) {
    //   const isOnline = !!users[id]
    //   setFriends((prev) => [...prev, { id, username, isOnline }]);
    // }
    setShowAlert(true);
  };

  // const handleAcceptFriendRequest = (id) => {
  //   socket.emit("acceptFriendRequest", id);
  //   setFriendRequestList((prev) => prev.filter((req) => req.id!== id));
  //   setShowAlert(true);
  // };

  // friendRequestList ? setShowAlert(true) : showAlert
  showAlert
    ? setTimeout(() => {
        setShowAlert(false);
      }, 2000)
    : showAlert;

  const handleStartChat = () => {
    navigate("/lobby-layout/private-chat");
  };

  console.log(users, "users list");

  const entryUser =  Object.entries(users)

  console.log(entryUser, "users array")

  console.log(searchQuery, "search query")

  const filteredUsers = Object.entries(users).filter(([id, username]) => (
    username.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white px-6">
      {/* alert component */}
      <SharedAlert
        title={"Friend Request Sent"}
        label={"A new friend request has been sent"}
        className={showAlert ? "block" : "hidden"}
      />
      {/* alert for friend request */}

      <h1 className="text-3xl font-semibold mb-4 text-center">Chat Lobby</h1>
      <p className="text-gray-300 mb-6 text-center">
        Search for users to add as friends or start a private chat.
      </p>

      {/* Search Bar */}
      <div className="w-full max-w-2xl mb-6">
        <SharedInput
          type={"text"}
          placeholder={"search for users..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={
            "w-full py-3 px-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        />
      </div>

      {/* Search Results Section */}
      <div className="w-full max-w-2xl bg-gray-700 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        {searchQuery && filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredUsers.map(([id, username]) => (
              <div
                key={id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  id === userID ? "hidden" : "bg-gray-800"
                } hover:bg-blue-500 transition duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <SharedAvatar
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                    alt={`${username}'s Avatar`}
                  />
                  <span className="text-gray-200 font-medium">{username}</span>
                </div>

                <SharedButton
                  className={"text-green-400 hover:text-green-500"}
                  handleClick={() => handleAddFriend(id, username)}
                  label={<FiPlus size={20} />}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            {searchQuery
              ? "No users found."
              : "Start typing to search for users."}
          </p>
        )}
      </div>

      {/* Friends List Section */}
      <div className="w-full max-w-2xl bg-gray-700 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Friend List</h2>
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {friends.map(({ id, username, isOnline }) => (
              <div
                key={id}
                className="flex items-center p-3 rounded-lg bg-gray-800 hover:bg-blue-500 transition duration-200"
                onClick={() => handleUserSelect(id, username)}
              >
                <SharedAvatar
                  className={`w-10 h-10 rounded-full border-2 ${
                    isOnline ? "border-green-500" : "border-gray-500"
                  }`}
                  alt={`${username}'s Avatar`}
                />
                <div className="ml-3">
                  <span className="text-white font-medium">{username}</span>
                  <p
                    className={`text-sm ${
                      isOnline ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No friends added yet.</p>
        )}
      </div>

      {/* Selected User Section */}
      {selectedUser && (
        <div className="w-full max-w-sm bg-gray-800 rounded-lg p-4 shadow-lg mb-8 text-center">
          <h3 className="text-lg font-semibold">Selected User</h3>
          <div className="flex flex-col items-center mt-4">
            <SharedAvatar
              className="w-16 h-16 rounded-full border-2 border-green-500 mb-2"
              alt={`${selectedUser.username}`}
            />
            <span className="text-white font-medium">
              {selectedUser.username}
            </span>
          </div>
        </div>
      )}

      {/* Private Chat Button */}
      <SharedButton
        className="w-full max-w-sm py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        handleClick={handleStartChat}
        disabled={!selectedUser}
        label="Start Private Chat ➔"
      />
    </div>
  );
};

export default ChatLobby;
