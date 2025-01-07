import { useAuthContext } from "@/hooks/useAuthContext";
import SharedButton from "@/shared/component/SharedButton";
import { logoutService } from "@/services/Auth/logoutService";
import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clientSocket, socket } from "@/services/weBSocket";


const LobbyLayout = () => {
  requireAuth();
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  // let userID = localStorage.getItem("userID");
  // const randomNumber = Math.floor(Math.random() * 111);
  // if (!userID) {
  //   userID = `user-${Date.now()}-${randomNumber}`;
  //   localStorage.setItem("userID", userID);
  // }
  const $user = JSON.parse(localStorage.getItem("user"));
  const { username, ID } = $user;
  let userID = ID
  const [onlineUsers, setOnlineUsers] = useState(0)
const [users, setUsers] = useState({})
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
      setOnlineUsers(userCount)
      setUsers(userList)
    });

    return()=>{
      socket.off("connect");
      socket.off("userRecords");
    }
  }, [userID , username]);


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
          // disabled={true}
        />

        <SharedButton
          handleClick={handleGroupChat}
          className={"bg-green-500 hover:bg-green-600 py-2 px-4 rounded mb-4"}
          label={"Group Chat Lobby"}
        />

        <div className="flex-grow"></div>
        <SharedButton
          handleClick={handleLogout}
          className={"bg-red-500 hover:bg-red-600 py-2 px-4 rounded mt-auto"}
          label={"Log Out"}
        />
      </div>

      {/* for sm Screen Sidebar Toggle */}
      <div className="md:hidden fixed top-0 left-0 bg-gray-800 text-white w-full p-4 z-10 mb-4">
        <SharedButton
          handleClick={toggleSidebar}
          className={"bg-blue-500 py-2 px-4 rounded hover:bg-blue-600"}
          label={"Menu"}
        />
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
              // disabled={true}
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
        <Outlet context={{onlineUsers, users , userID}} />
      </div>
    </div>
  );
};

export default LobbyLayout;
