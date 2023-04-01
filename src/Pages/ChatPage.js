import React from "react";
import "../static/css/ChatPage.css";
import SideBar from "../Components/SideBar";
import ChatArea from "../Components/ChatArea";

const ChatPage = () => {
  return (
    <>
      <div className="chatPage">
        <SideBar />
        <ChatArea />
      </div>
    </>
  );
};

export default ChatPage;
