import { NavLink } from "react-router-dom";

function SplashScreen() {
  return (
    <div className="text-center flex flex-col items-center justify-center h-screen px-4 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-2">Welcome to GhostConnect!</h2>
      <q className="text-lg italic mb-4">Disappear into conversation.</q>

      <h3 className="text-xl mb-2">Connect with anyone, anywhere, without revealing a trace.</h3>
      <p className="text-center max-w-md mb-4">
        Dive into chats that keep you anonymous but connected. No profiles, no judgments—
        just real-time conversations in a space that`s private, fast, and secure.
      </p>
      <p className="text-lg font-semibold mb-6">Your words, your world.</p>

      <NavLink
        to="/login"
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition duration-200"
      >
        Get Started ➔
      </NavLink>
    </div>
  );
}

export default SplashScreen;
