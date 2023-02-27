import React from "react";
import Login from "./Pages/Login/Login";
import ChatPage from "./Pages/ChatPage/ChatPage";
import { auth } from "./FConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const App = () => {
  const [user] = useAuthState(auth);

  return <>{user ? <ChatPage /> : <Login />}</>;
};

export default App;
