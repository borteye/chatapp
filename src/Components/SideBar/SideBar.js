import React from "react";
import "./SideBar.css";
import logoutImg from "../../Assets/logout.svg";
import db from "../../FConfig";
import { auth } from "../../FConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  logout,
  FriendsWidget,
  GroupChatWidget,
} from "../../Functionalities/Functionality";

const SideBar = ({
  setFriendName,
  setGetCombinedUid,
  setCurrentUserEmail,
  setGroupName,
  setGetGroupUid,
}) => {
  //current user
  const currentUser = auth.currentUser;

  setCurrentUserEmail(currentUser.email);

  //get all friends of currentUser
  const [userFriends] = useCollection(
    db.collection("users").doc(currentUser.uid).collection("friends")
  );

  // get all groupChat platforms the currentUser belongs to
  const [groups] = useCollection(
    db.collection("users").doc(currentUser.uid).collection("groups")
  );

  //select a chat and combine the uid's of both currentUser and of selected chat
  const selectChat = (data, id) => {
    setGroupName(null);
    setFriendName(data.name);

    const combinedUid =
      currentUser.uid < id ? currentUser.uid + id : id + currentUser.uid;
    setGetCombinedUid(combinedUid.trim());
  };

  //select a groupChat
  const selectGroupChat = (data, id) => {
    setFriendName(null);
    setGroupName(data.groupName);
    setGetGroupUid(id);
  };

  return (
    <>
      <div className="sidebar">
        <div className="container">
          <div className="content">
            <div className="section_one">
              <p>REA CHAT</p>
              <hr />
            </div>

            <div className="section_two">
              {userFriends?.docs.map((friends) => {
                return (
                  <FriendsWidget
                    data={friends?.data()}
                    id={friends?.id}
                    selectChat={selectChat}
                  />
                );
              })}
              {groups?.docs.map((groupChat) => {
                return (
                  <GroupChatWidget
                    data={groupChat?.data()}
                    id={groupChat?.id}
                    selectGroupChat={selectGroupChat}
                  />
                );
              })}
            </div>
            <div className="section_three">
              <button onClick={logout}>
                <img src={logoutImg} alt="" />
                <p>Logout</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
