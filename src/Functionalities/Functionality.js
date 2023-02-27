import profile from "../Assets/profile1.jpg";
import db from "../FConfig";
import { auth } from "../FConfig";
import { Timestamp } from "firebase/firestore";
// signOut currentUser
export const logout = () => {
  auth.signOut();
};

//return friends list on the SideBar
export const FriendsWidget = ({ data, id, selectChat }) => {
  return (
    <>
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
    </>
  );
};

export const GroupChatWidget = ({ data, id, selectGroupChat }) => {
  return (
    <>
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
    </>
  );
};

export const handleSendMessage = async (
  e,
  text,
  setText,
  getCombinedUid,
  currentUserEmail,
  uniqueId,
  imageURL,
  setImageURL
) => {
  e.preventDefault();

  const result = await db.collection("chats").doc(getCombinedUid).get();

  // checking if a db with the combindedUID exists or not
  if (result.exists) {
    // explain this block of code
    if (!text) {
      db.collection("chats")
        .doc(getCombinedUid)
        .collection("messages")
        .doc(uniqueId)
        .set(
          {
            image: imageURL,
            email: currentUserEmail,
            id: uniqueId,
            createdAt: Timestamp.now(),
          },
          { merge: true }
        );
    } else if (imageURL === null) {
      db.collection("chats")
        .doc(getCombinedUid)
        .collection("messages")
        .doc(uniqueId)
        .set(
          {
            message: text,
            email: currentUserEmail,
            id: uniqueId,
            createdAt: Timestamp.now(),
          },
          { merge: true }
        );
    } else if (text && imageURL !== null) {
      db.collection("chats")
        .doc(getCombinedUid)
        .collection("messages")
        .doc(uniqueId)
        .set(
          {
            message: text,
            image: imageURL,
            email: currentUserEmail,
            id: uniqueId,
            createdAt: Timestamp.now(),
          },
          { merge: true }
        );
    }
  } else {
    if (!text) {
      db.collection("chats")
        .doc(getCombinedUid)
        .collection("messages")
        .doc(uniqueId)
        .set({
          image: imageURL,
          email: currentUserEmail,
          id: uniqueId,
          createdAt: Timestamp.now(),
        });
    } else if (imageURL === null) {
      db.collection("chats")
        .doc(getCombinedUid)
        .collection("messages")
        .doc(uniqueId)
        .set({
          message: text,
          email: currentUserEmail,
          id: uniqueId,
          createdAt: Timestamp.now(),
        });
    } else if (text && imageURL !== null) {
      db.collection("chats")
        .doc(getCombinedUid)
        .collection("messages")
        .doc(uniqueId)
        .set({
          message: text,
          image: imageURL,
          email: currentUserEmail,
          id: uniqueId,
          createdAt: Timestamp.now(),
        });
    }
  }
  setText("");
  setImageURL(null);
};
