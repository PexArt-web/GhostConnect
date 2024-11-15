import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useAuthContext } from "@/hooks/useAuthContext";
import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { connectSocket, socket } from "@/services/weBSocket";
import SharedButton from "@/shared/component/SharedButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GroupLobby = () => {
  requireAuth();
  // const { user } = useAuthContext();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [users, setUsers] = useState({});
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/lobby-layout/group-chat");
  };

  useEffect(()=>{
    connectSocket();
  },[])

  useEffect(()=>{
      socket.on("connect", ()=>{
        console.log(socket.id,"client id")
      })
  },[])

  // function weBSocket() {
  //   connectSocket();
  //   socket.on("connect", () => {
  //     socket.emit("username", user?.username);
  //   });

  //   socket.on("clients-total", (clientsTotal) => {
  //     setOnlineUsers(clientsTotal);
  //   });

  //   socket.on("users-list", (usersList) => {
  //     setUsers(usersList);
  //   });
  // }

  // weBSocket();



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
        <div className="flex flex-wrap gap-4">
          {Object.entries(users).map(([id, username]) => (
            <div key={id} className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-gray-200 font-medium">{username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enter Chat Button */}
      <SharedButton
        className={
          "w-full max-w-xs py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        }
        label={"Enter Chat Room ➔"}
        handleClick={handleClick}
      />
    </div>
  );
};
export default GroupLobby;
