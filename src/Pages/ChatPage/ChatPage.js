import React, { useState } from "react";
import "./ChatPage.css";
import SideBar from "../../Components/SideBar/SideBar";
import ChatArea from "../../Components/ChatArea/ChatArea";

const ChatPage = () => {
  //get and store friends name
  const [friendName, setFriendName] = useState();

  //get and store groupChats name
  const [groupName, setGroupName] = useState();

  //get and store currentUser's email
  const [currentUserEmail, setCurrentUserEmail] = useState();

  //get uid of both friend's and currentUser combined
  const [getCombinedUid, setGetCombinedUid] = useState();

  //get the uid of the group chat
  const [getGroupUid, setGetGroupUid] = useState();

  return (
    <>
      <div className="chatPage">
        <SideBar
          setFriendName={setFriendName}
          setGetCombinedUid={setGetCombinedUid}
          setCurrentUserEmail={setCurrentUserEmail}
          setGroupName={setGroupName}
          setGetGroupUid={setGetGroupUid}
        />
        <ChatArea
          friendName={friendName}
          getCombinedUid={getCombinedUid}
          currentUserEmail={currentUserEmail}
          groupName={groupName}
          getGroupUid={getGroupUid}
        />
      </div>
    </>
  );
};

export default ChatPage;
