import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Splash from "./pages/SplashScreen/Splash";
import ChatLobby from "./pages/Lobbies/private/ChatLobby";
import MainChat from "./pages/Lobbies/private/MainChat";
import AllRoutesError from "./pages/Errors/AllRoutesError";
import GroupChat from "./pages/Lobbies/public/GroupChat";
import GroupLobby from "./pages/Lobbies/public/GroupLobby";
import LobbyLayout from "./layouts/LobbyLayout";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import { loginAction } from "./handlers/Auth/loginAction";
import { signupAction } from "./handlers/Auth/signupAction";
import { messageLoader, privateMessageLoader } from "./loaders/messageLoader";
import pageLoadError from "./pages/Errors/PageLoadError";
import { friendListLoader } from "./loaders/userLoader";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Splash />} />
        <Route path="get-started" action={signupAction} element={<Signup />} />
        <Route path="/login" action={loginAction} element={<Login />} />
        <Route path="lobby-layout" loader = {friendListLoader} element={<LobbyLayout />}>
          <Route path="private-chat-lobby" element={<ChatLobby />} />
          <Route path="private-chat" element={<MainChat />} loader={privateMessageLoader} errorElement = {pageLoadError} />
          <Route path="group-chat-lobby" element={<GroupLobby />} />
          <Route
            path="group-chat"
            loader={messageLoader}
            element={<GroupChat />}
          />
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
