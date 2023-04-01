import React from "react";
import "../static/css/SideBar.css";
import logoutImg from "../static/Assets/logout.svg";
import profile from "../static/Assets/profile1.jpg";
import db from "../FConfig";
import { auth } from "../FConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import { SelectUid, setUserLogoutState } from "../features/userSlice";
import {
  setfriendChatState,
  setgroupChatState,
  SelectFriendName,
  SelectCombinedId,
  SelectGroupId,
  SelectGroupName,
} from "../features/selectChatSlice";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userUid = useSelector(SelectUid);
  const friendsName = useSelector(SelectFriendName);
  const combinedId = useSelector(SelectCombinedId);
  const groupsName = useSelector(SelectGroupName);
  const groupId = useSelector(SelectGroupId);

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(
          setUserLogoutState(),
          setfriendChatState({
            friendsName: null,
            combinedId: "0",
            groupsName: null,
          }),
          setgroupChatState({
            groupsName: null,
            groupId: "0",
            friendsName: null,
          })
        );
        navigate("/");
      })
      .catch((err) => alert(err.message));
  };

  //get all friends of currentUser
  const [userFriends] = useCollection(
    db.collection("users").doc(userUid).collection("friends")
  );

  // get all groupChat platforms the currentUser belongs to
  const [groups] = useCollection(
    db.collection("users").doc(userUid).collection("groups")
  );

  //select a chat and combine the uid's of both currentUser and of selected chat
  const selectChat = (data, id) => {
    const combinedUid = userUid < id ? userUid + id : id + userUid;
    dispatch(
      setfriendChatState({
        friendsName: data.name,
        combinedId: combinedUid.trim(),
        groupsName: null,
      })
    );
  };

  //select a groupChat
  const selectGroupChat = (data, id) => {
    dispatch(
      setgroupChatState({
        groupsName: data.groupName,
        groupId: id,
        friendsName: null,
      })
    );
  };

  const FriendsWidget = ({ data, id }) => {
    return (
      <div
        className="chats"
        key={id}
        onClick={() => {
          selectChat(data, id);
        }}
      >
        <img src={profile} alt="" />
        <div className="name_lastMessage">
          <div className="name">
            <strong>{data?.name}</strong>
          </div>
          <div className="lastMessage">Sup man, wanna go out?</div>
        </div>
      </div>
    );
  };

  const GroupChatWidget = ({ data, id }) => {
    return (
      <div
        className="chats"
        key={id}
        onClick={() => {
          selectGroupChat(data, id);
        }}
      >
        <img src={profile} alt="" />
        <div className="name_lastMessage">
          <div className="name">
            <strong>{data?.groupName}</strong>
          </div>
          <div className="lastMessage">Sup man, wanna go out?</div>
        </div>
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="container">
        <div className="content">
          <div className="section_one">
            <p>REA CHAT</p>
            <hr />
          </div>

          <div className="section_two">
            {userFriends?.docs.map((friends) => {
              return <FriendsWidget data={friends?.data()} id={friends?.id} />;
            })}
            {groups?.docs.map((groupChat) => {
              return (
                <GroupChatWidget data={groupChat?.data()} id={groupChat?.id} />
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
  );
};

export default SideBar;
