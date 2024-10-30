import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Splash from "./Pages/SplashScreen/Splash";
import Login from "./Pages/Auth/Login";
import Lobby from "./Pages/Lobbies/public/Lobby";
import ChatLobby from "./Pages/Lobbies/private/ChatLobby";
import MainChat from "./Pages/Lobbies/private/MainChat";
import AllRoutesError from "./Pages/Errors/AllRoutesError";
import GroupChat from "./Pages/Lobbies/public/GroupChat";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Splash />} />
        <Route path="get-started" element={<Login/>} />
        <Route path="lobby" element = {<Lobby/>} />
        <Route path="chat-lobby" element= {<ChatLobby/>} />
        <Route path="main-chat" element={<MainChat/>} />
        <Route path="group-chat" element={<GroupChat/>} />
        <Route path="*" element = {<AllRoutesError/>} />
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
