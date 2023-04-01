import React, { useRef, useEffect } from "react";
import "../static/css/Messages.css";
import profile from "../static/Assets/profile1.jpg";
import thumbsup from "../static/Assets/thumbsup.svg";
import db from "../FConfig";
import { deleteField } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import {
  SelectCombinedId,
  SelectGroupId,
  SelectFriendName,
} from "../features/selectChatSlice";
import { SelectEmail } from "../features/userSlice";

const Messages = () => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });

  const combinedId = useSelector(SelectCombinedId);
  const groupId = useSelector(SelectGroupId);
  const userEmail = useSelector(SelectEmail);
  const friendsName = useSelector(SelectFriendName);

  const [singleChat] = useCollection(
    db
      .collection("chats")
      .doc(combinedId)
      .collection("messages")
      .orderBy("createdAt")
  );

  const [groupChat] = useCollection(
    db
      .collection("groupchats")
      .doc(groupId)
      .collection("chats")
      .orderBy("createdAt")
  );

  const SingleChatWidget = ({ data, id }) => {
    const ref = useRef();

    useEffect(() => {
      ref.current?.scrollIntoView({ behaviour: "smooth" });
    }, [data]);
    return (
      <div
        ref={ref}
        className={data.email === userEmail ? "chat_sent" : "chat_received"}
        key={id}
      >
        <div className="overall">
          <div className="profile_message">
            <div className="profile">
              <img src={profile} alt="" />
            </div>
            <div className="message">
              {data.message !== undefined && <p>{data.message}</p>}
              {data.image !== undefined && (
                <p>
                  <img src={data.image} alt="" className="messageImg" />
                </p>
              )}
              {data.likedislike === "liked" && (
                <div className="likes">
                  <img src={thumbsup} alt="" className="likeImg" />
                  {data.numberofLikes > 1 && (
                    <div className="numberOfLikes">
                      {formatter.format(data.numberofLikes)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="like_dislike">
            <button
              onClick={() => {
                handleLike(data.id);
              }}
            >
              <img src={thumbsup} alt="" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const GroupChatWidget = ({ data, id }) => {
    const ref = useRef();

    useEffect(() => {
      ref.current?.scrollIntoView({ behaviour: "smooth" });
    }, [data]);
    return (
      <div
        ref={ref}
        className={
          data.senderEmail === userEmail ? "chat_sent" : "chat_received"
        }
        key={id}
      >
        <div className="overall">
          <div className="profile_message">
            <div className="profile">
              <img src={profile} alt="" />
              {data.senderEmail !== userEmail && (
                <div className="name">{data.senderName}</div>
              )}
            </div>
            <div className="message">
              {data.message !== undefined && <p>{data.message}</p>}
              {data.image !== undefined && (
                <p>
                  <img src={data.image} alt="" className="messageImg" />
                </p>
              )}
              {data.likedislike === "liked" && (
                <div className="likes">
                  <img src={thumbsup} alt="" className="likeImg" />
                  {data.numberofLikes > 1 && (
                    <div className="numberOfLikes">
                      {formatter.format(data.numberofLikes)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="like_dislike">
            <button
              onClick={() => {
                handleLike(data.id);
              }}
            >
              <img src={thumbsup} alt="" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleLike = async (id) => {
    const groupChatUserLiked = await db
      .collection("groupchats")
      .doc(groupId)
      .collection("chats")
      .doc(id)
      .collection("likedby")
      .doc(userEmail)
      .get();

    const singleChatUserLiked = await db
      .collection("chats")
      .doc(combinedId)
      .collection("messages")
      .doc(id)
      .collection("likedby")
      .doc(userEmail)
      .get();

    const deleteUserEmail = async () => {
      await db
        .collection("groupchats")
        .doc(groupId)
        .collection("chats")
        .doc(id)
        .collection("likedby")
        .doc(userEmail)
        .delete();
    };

    const deleteSingleChatUserEmail = async () => {
      await db
        .collection("chats")
        .doc(combinedId)
        .collection("messages")
        .doc(id)
        .collection("likedby")
        .doc(userEmail)
        .delete();
    };

    const addUserEmail = async () => {
      await db
        .collection("groupchats")
        .doc(groupId)
        .collection("chats")
        .doc(id)
        .collection("likedby")
        .doc(userEmail)
        .set({
          email: userEmail,
        });
    };

    const addSingleChatUserEmail = async () => {
      await db
        .collection("chats")
        .doc(combinedId)
        .collection("messages")
        .doc(id)
        .collection("likedby")
        .doc(userEmail)
        .set({
          email: userEmail,
        });
    };

    if (!friendsName) {
      groupChat?.docs.map((grpChat) => {
        const details = grpChat?.data();
        if (details.likedislike) {
          if (groupChatUserLiked.exists) {
            db.collection("groupchats")
              .doc(groupId)
              .collection("chats")
              .doc(id)
              .set(
                {
                  numberofLikes: (details.numberofLikes -= 1),
                },
                { merge: true }
              );
            deleteUserEmail();
            if (details.numberofLikes === 0) {
              db.collection("groupchats")
                .doc(groupId)
                .collection("chats")
                .doc(id)
                .set(
                  {
                    likedislike: deleteField(),
                    numberofLikes: deleteField(),
                  },
                  { merge: true }
                );
              deleteUserEmail();
            }
          } else if (!groupChatUserLiked.exists) {
            addUserEmail();
            db.collection("groupchats")
              .doc(groupId)
              .collection("chats")
              .doc(id)
              .set(
                {
                  numberofLikes: (details.numberofLikes += 1),
                },
                { merge: true }
              );
          }
        } else {
          addUserEmail();
          db.collection("groupchats")
            .doc(groupId)
            .collection("chats")
            .doc(id)
            .set(
              {
                likedislike: "liked",
                numberofLikes: 1,
              },
              { merge: true }
            );
        }
      });
    } else {
      singleChat?.docs.map((info) => {
        const likedInfo = info?.data();
        if (likedInfo.likedislike) {
          if (singleChatUserLiked.exists) {
            db.collection("chats")
              .doc(combinedId)
              .collection("messages")
              .doc(id)
              .set(
                {
                  numberofLikes: (likedInfo.numberofLikes -= 1),
                },
                { merge: true }
              );
            deleteSingleChatUserEmail();
            if (likedInfo.numberofLikes === 0) {
              db.collection("chats")
                .doc(combinedId)
                .collection("messages")
                .doc(id)
                .set(
                  {
                    likedislike: deleteField(),
                    numberofLikes: deleteField(),
                  },
                  { merge: true }
                );
              deleteSingleChatUserEmail();
            }
          } else if (!singleChatUserLiked.exists) {
            addSingleChatUserEmail();
            db.collection("chats")
              .doc(combinedId)
              .collection("messages")
              .doc(id)
              .set(
                {
                  numberofLikes: (likedInfo.numberofLikes += 1),
                },
                { merge: true }
              );
          }
        } else {
          addSingleChatUserEmail();
          db.collection("chats")
            .doc(combinedId)
            .collection("messages")
            .doc(id)
            .set(
              {
                likedislike: "liked",
                numberofLikes: 1,
              },
              { merge: true }
            );
        }
      });
    }
  };

  return (
    <div className="messages">
      {friendsName
        ? singleChat?.docs.map((text) => {
            return (
              <>
                <SingleChatWidget data={text?.data()} id={text?.id} />
              </>
            );
          })
        : groupChat?.docs.map((groupText) => {
            return (
              <>
                <GroupChatWidget data={groupText?.data()} id={groupText?.id} />
              </>
            );
          })}
    </div>
  );
};

export default Messages;
