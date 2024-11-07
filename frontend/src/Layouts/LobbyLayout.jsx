import { useAuthContext } from "@/Hooks/useAuthContext";
import SharedButton from "@/shared/component/SharedButton";
import { logoutService } from "@/Utils/Auth/logoutService";
import { requireAuth } from "@/Utils/Auth/middleware/requireAuth";
import { Outlet, useNavigate } from "react-router-dom";

const LobbyLayout = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  requireAuth();
  const handlePrivateChat = () => {
    navigate("private-chat-lobby");
  };

  const handleGroupChat = () => {
    navigate("group-chat-lobby");
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    logoutService();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
        {/* User Info */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Welcome, {user?.username || user?.email || "Guest"}
          </h2>
        </div>

        <h2 className="text-xl font-bold mb-4">Chat Lobbies</h2>
        <SharedButton
          onClick={handlePrivateChat}
          className={"bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded mb-2"}
          label={"Private Chat Lobby"}
        />

        <SharedButton
          onClick={handleGroupChat}
          className={"bg-green-500 hover:bg-green-600 py-2 px-4 rounded mb-4"}
          label={"Group Chat Lobby"}
        />

        <div className="flex-grow"></div>
        <SharedButton
          onClick={handleLogout}
          className={"bg-red-500 hover:bg-red-600 py-2 px-4 rounded mt-auto"}
          label={"Log Out"}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-gray-100 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default LobbyLayout;
