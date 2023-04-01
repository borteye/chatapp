import React from "react";
import "../static/css/ChatArea.css";
import Messages from "./Messages";
import SendMessage from "./SendMessage";
import { useSelector } from "react-redux";
import { SelectFriendName, SelectGroupName } from "../features/selectChatSlice";

const ChatArea = () => {
  const friendsName = useSelector(SelectFriendName);
  const groupsName = useSelector(SelectGroupName);
  return (
    <>
      <div className="chatArea">
        <div className="container">
          <div className="content">
            <div className="section_one">
              <div className="name">
                <strong>{!groupsName ? friendsName : groupsName} </strong>
              </div>
            </div>
            <div className="section_two">
              <Messages />
            </div>
            <div className="section_three">
              <SendMessage />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatArea;
