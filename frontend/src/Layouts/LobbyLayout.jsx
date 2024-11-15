import { useAuthContext } from "@/hooks/useAuthContext";
import SharedButton from "@/shared/component/SharedButton";
import { logoutService } from "@/services/Auth/logoutService";
import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { Outlet, useNavigate } from "react-router-dom";

const LobbyLayout = () => {
  requireAuth();
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  console.log(user, "users")
  const handlePrivateChat = () => {
    navigate("private-chat-lobby");
  };

  const handleGroupChat = () => {
    navigate("group-chat-lobby");
  };

  const handleLogout = async () => {
    dispatch({ type: "LOGOUT" });
    console.log("logged out", user);
    await logoutService();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
        {/* User Info */}
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
          disabled={true}
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

      {/* Main Chat Area */}
      <div className="flex-1 bg-gray-100 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default LobbyLayout;
