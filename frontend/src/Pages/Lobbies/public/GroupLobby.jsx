import { requireAuth } from "@/services/Auth/middleware/requireAuth";
import SharedButton from "@/shared/component/SharedButton";
import { useNavigate } from "react-router-dom";

const GroupLobby = () => {
  requireAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/lobby-layout/group-chat");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-900 text-white px-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide animate-pulse">
        Welcome to GhostConnect
      </h1>
      <p className="text-gray-400 mb-12 text-center max-w-lg">
        Step into an anonymous world of connection. Join the conversation and uncover the stories waiting to be told.
      </p>

      {/* Animated Graphic */}
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full blur-xl opacity-50 animate-spin-slow"></div>
        <div className="absolute inset-0 bg-gray-800 rounded-full border-4 border-gray-700"></div>
      </div>

      {/* Enter Chat Button */}
      <SharedButton
        className="py-4 px-8 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg"
        label={"Enter Chat Room ➔"}
        handleClick={handleClick}
      />
    </div>
  );
};

export default GroupLobby;
