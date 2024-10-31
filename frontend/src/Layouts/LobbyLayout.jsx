import { Outlet, useNavigate } from "react-router-dom";

const LobbyLayout = () => {
  const navigate = useNavigate();

  const handlePrivateChat = () => {
    navigate("private-chat-lobby");
  };

  const handleGroupChat = () => {
    navigate("group-chat-lobby");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col space-y-4">
        <h2 className="text-xl font-bold">Chat Lobbies</h2>
        <button
          onClick={handlePrivateChat}
          className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
        >
          Private Chat Lobby
        </button>
        <button
          onClick={handleGroupChat}
          className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded"
        >
          Group Chat Lobby
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-gray-100 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default LobbyLayout;
