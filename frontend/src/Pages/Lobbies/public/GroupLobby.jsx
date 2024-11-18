import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/hooks/useAuthContext";
import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import { clientSocket, socket } from "@/services/weBSocket";
import SharedButton from "@/shared/component/SharedButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GroupLobby = () => {
  requireAuth();
  const { user } = useAuthContext();
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [users, setUsers] = useState({});
  
  const usersname  = user?.username
 
  // socket instance
  useEffect(() => {
    console.log("use effect ran");
    clientSocket();

    // creating userId to use as keys for socketID cause it doesn't change on every request or refresh using this to get real count value 
    let userID = localStorage.getItem('userID');
    if(!userID){
      userID = `user-${Date.now()}`
      localStorage.setItem('userID', userID);
    }

    socket.on("connect", () => {
      console.log(socket.id)
    });

    socket.emit("userIdentifier", userID)
    
    socket.emit("userName", usersname);

    //<--//-->
    socket.on("userList", (data)=>{
      setUsers(data);
      console.log("userList", data);
    })

    socket.on("activeUsers", (data)=>{
      setOnlineUsersCount(data);
      console.log("activeUsers", data);
    })
  }, []);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/lobby-layout/group-chat");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white px-6">
      <h1 className="text-3xl font-semibold mb-4">Welcome to GhostConnect</h1>
      <p className="text-gray-300 mb-8 text-center">
        Connect with others anonymously and explore conversations in real time.
      </p>

      {/* Online Users Display */}
      <div className="w-full max-w-lg bg-gray-700 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Online Users ( {onlineUsersCount} )
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
