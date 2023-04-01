import React from "react";
import Login from "./Pages/Login";
import ChatPage from "./Pages/ChatPage";
import SignUp from "./Pages/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
