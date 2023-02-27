import React from "react";
import "./ChatArea.css";
import Messages from "../Messages/Messages";
import SendMessage from "../SendMessage/SendMessage";

const ChatArea = ({
  friendName,
  getCombinedUid,
  currentUserEmail,
  groupName,
  getGroupUid,
}) => {
  return (
    <>
      <div className="chatArea">
        <div className="container">
          <div className="content">
            <div className="section_one">
              <div className="name">
                <strong>{!friendName ? groupName : friendName} </strong>
              </div>
            </div>
            <div className="section_two">
              <Messages
                getCombinedUid={getCombinedUid}
                currentUserEmail={currentUserEmail}
                getGroupUid={getGroupUid}
                friendName={friendName}
              />
            </div>
            <div className="section_three">
              <SendMessage
                getCombinedUid={getCombinedUid}
                currentUserEmail={currentUserEmail}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatArea;
