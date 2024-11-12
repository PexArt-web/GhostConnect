import { useAuthContext } from "@/hooks/useAuthContext";
import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { connectSocket, socket } from "@/services/weBSocket";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GroupLobby = () => {
  requireAuth();
  const { user } = useAuthContext();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/lobby-layout/group-chat");
  };

  connectSocket();
  socket.on("connect", () => {
    console.log(socket.id, "socket id");
    socket.emit("username", user?.username);
    console.log(user?.username, "username");
  });

  socket.on("clients-total", (data) => {
    console.log(data);
    setOnlineUsers(data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  // useEffect(() => {
  //   socketServer();
  //   return () => {
  //     socket.off("disconnect");
  //     socket.off("connect");
  //     socket.off("clients-total");
  //   };
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white px-6">
      <h1 className="text-3xl font-semibold mb-4">Welcome to GhostConnect</h1>
      <p className="text-gray-300 mb-8 text-center">
        Connect with others anonymously and explore conversations in real time.
      </p>

      {/* Online Users Display */}
      <div className="w-full max-w-lg bg-gray-700 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Online Users ( {onlineUsers} )
        </h2>
        {/* <div className="flex flex-wrap gap-4">
          {onlineUsersData.map((user) => (
            <div key={user.id} className="flex items-center space-x-2">
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <span className="text-gray-200 font-medium">{user.name}</span>
            </div>
          ))}
        </div> */}
      </div>

      {/* Enter Chat Button */}
      <button
        className="w-full max-w-xs py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        // onClick={() => alert("Navigating to chat...")}
        onClick={handleClick}
      >
        Enter Chat Room ➔
      </button>
    </div>
  );
};

export default GroupLobby;
