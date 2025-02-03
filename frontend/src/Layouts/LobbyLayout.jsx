import { useAuthContext } from "@/hooks/useAuthContext";
import SharedButton from "@/shared/component/SharedButton";
import { logoutService } from "@/services/Auth/logoutService";
import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clientSocket, socket } from "@/services/weBSocket";
import { FiUserPlus } from "react-icons/fi";
import SharedAlert from "@/shared/component/SharedAlert";

const LobbyLayout = () => {
  requireAuth();
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFriendRequestOpen, setIsFriendRequestOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [requestNotification, setRequestNotification] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFriendRequest = () =>
    setIsFriendRequestOpen(!isFriendRequestOpen);

  const $user = JSON.parse(localStorage.getItem("user"));
  const { username, ID } = $user;
  let userID = ID;

  const [onlineUsers, setOnlineUsers] = useState(0);
  const [users, setUsers] = useState({});

  const handlePrivateChat = () => {
    navigate("private-chat-lobby");
  };

  const handleGroupChat = () => {
    navigate("group-chat-lobby");
  };

  const handleLogout = async () => {
    dispatch({ type: "LOGOUT" });
    await logoutService();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    clientSocket();
    socket.on("connect", () => {
      const userDetails = { id: userID, username: username };
      socket.emit("userDetails", userDetails);
    });

    socket.on("userRecords", ({ userCount, userList }) => {
      setOnlineUsers(userCount - 1);
      setUsers(userList);
    });

    socket.on("friendRequest", (requests) => {
      setRequestNotification(true);
      setFriendRequests(requests);
    });
  

    return () => {
      socket.off("connect");
      socket.off("userRecords");
      socket.off("friendRequest");
    };
  }, [userID, username, requestNotification]);
  console.log(
    requestNotification,
    "requestNotification",
    "after lobby layout effect"
  );



  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-1/4 bg-gray-800 text-white p-4 flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Welcome, {user?.username || "Guest"}
          </h2>
        </div>

        <h2 className="text-xl font-bold mb-4">Chat Lobbies</h2>
        <SharedButton
          handleClick={handlePrivateChat}
          className={"bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded mb-2"}
          label={"Private Chat Lobby"}
        />

        <SharedButton
          handleClick={handleGroupChat}
          className={"bg-green-500 hover:bg-green-600 py-2 px-4 rounded mb-4"}
          label={"Group Chat Lobby"}
        />

        {/* Friend Request Section */}
        <div className="relative mb-4">
          <SharedButton
            handleClick={toggleFriendRequest}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded"
            label={`${(<FiUserPlus className="text-lg" />)}
            "Friend Requests"`}
          />

          {isFriendRequestOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white text-black rounded shadow-lg p-4 z-10">
              <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
              {friendRequests.length > 0 ? (
                <ul>
                  {friendRequests.map((request, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center mb-2 last:mb-0"
                    >
                      <span>{request.username}</span>
                      <SharedButton
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                        label={"Accept"}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No new friend requests.</p>
              )}
            </div>
          )}

          <SharedAlert
            title={"New Friend Request"}
            label={"You have a new friend request from"}
            button={true}
            openNotification={requestNotification}
            onClose={() => setRequestNotification(false)}
         
          />
        </div>

        <div className="flex-grow"></div>
        <SharedButton
          handleClick={handleLogout}
          className={"bg-red-500 hover:bg-red-600 py-2 px-4 rounded mt-auto"}
          label={"Log Out"}
        />
      </div>

      {/* for sm Screen Sidebar Toggle */}
      <div className="md:hidden fixed top-0 left-0 bg-gray-800 text-white w-full p-4 z-10 mb-4 flex justify-between items-center">
        <SharedButton
          handleClick={toggleSidebar}
          className={"bg-blue-500 py-2 px-4 rounded hover:bg-blue-600"}
          label={"Menu"}
        />

        <SharedAlert
          title={"New Friend Request"}
          label={"You have a new friend request from"}
          button={true}
          openNotification={requestNotification}
          onClose={() => setRequestNotification(false)}
        />
        {/* Friend Request Button for Small Screens */}
        <div className="relative">
          <SharedButton
            handleClick={toggleFriendRequest}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded"
            label={<FiUserPlus className="text-lg" />}
          />

          {isFriendRequestOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white text-black rounded shadow-lg p-4 z-20">
              <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
              {friendRequests.length > 0 ? (
                <ul>
                  {friendRequests.map((request, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center mb-2 last:mb-0"
                    >
                      <span>{request.username}</span>
                      <SharedButton
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                      label={"Accept"}
                      />
                      
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No new friend requests.</p>
              )}
            </div>
          )}
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        >
          <div className="bg-gray-800 text-white w-3/4 sm:w-1/2 p-4 h-full">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                Welcome, {user?.username || "Guest"}
              </h2>
            </div>

            <h2 className="text-xl font-bold mb-4">Chat Lobbies</h2>
            <SharedButton
              handleClick={handlePrivateChat}
              className={"bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded mb-2"}
              label={"Private Chat Lobby"}
            />

            <SharedButton
              handleClick={handleGroupChat}
              className={
                "bg-green-500 hover:bg-green-600 py-2 px-4 rounded mb-4"
              }
              label={"Group Chat Lobby"}
            />

            <SharedButton
              handleClick={handleLogout}
              className={"bg-red-500 hover:bg-red-600 py-2 px-4 rounded"}
              label={"Log Out"}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-4 mt-16 md:mt-0">
        <Outlet context={{ onlineUsers, users, userID }} />
      </div>
    </div>
  );
};

export default LobbyLayout;
