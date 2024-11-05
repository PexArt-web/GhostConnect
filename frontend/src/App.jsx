import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Splash from "./Pages/SplashScreen/Splash";
import ChatLobby from "./Pages/Lobbies/private/ChatLobby";
import MainChat from "./Pages/Lobbies/private/MainChat";
import AllRoutesError from "./Pages/Errors/AllRoutesError";
import GroupChat from "./Pages/Lobbies/public/GroupChat";
import GroupLobby from "./Pages/Lobbies/public/GroupLobby";
import LobbyLayout from "./Layouts/LobbyLayout";
import Signup from "./Pages/Auth/Signup";
import Login from "./Pages/Auth/Login";
import { loginAction } from "./Handlers/Auth/loginAction";
import { signupAction } from "./Handlers/Auth/signupAction"
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Splash />} />
        <Route path="get-started" action={signupAction} element={<Signup />} />
        <Route path="/login" action={loginAction} element={<Login />} />
        <Route path="lobby-layout" element={<LobbyLayout />}>
          <Route path="private-chat-lobby" element={<ChatLobby />} />
          <Route path="private-chat" element={<MainChat />} />
          <Route path="group-chat-lobby" element={<GroupLobby />} />
          <Route path="group-chat" element={<GroupChat />} />
        </Route>
        <Route path="*" element={<AllRoutesError />} />
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
