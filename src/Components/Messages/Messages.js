import React, { useEffect, useRef, useState } from "react";
import "./Messages.css";
import profile from "../../Assets/profile1.jpg";
import thumbsup from "../../Assets/thumbsup.svg";
import thumbsdown from "../../Assets/thumbsdown.svg";
import db from "../../FConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import { deleteField } from "firebase/firestore";

const Messages = ({
  getCombinedUid,
  currentUserEmail,
  getGroupUid,
  friendName,
}) => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });

  const [Chats, loading, error] = useCollection(
    db
      .collection("chats")
      .doc(getCombinedUid)
      .collection("messages")
      .orderBy("createdAt")
  );

  const [groupChat] = useCollection(
    db
      .collection("groupchats")
      .doc(getGroupUid)
      .collection("chats")
      .orderBy("createdAt")
  );

  //return of the list of chats inside messages collection and display them
  const MessageWidget = ({ chat }) => {
    //scroll smoothly to the recent text sent

    const ref = useRef();

    useEffect(() => {
      ref.current?.scrollIntoView({ behaviour: "smooth" });
    }, [chat]);

    return (
      <>
        <ul>
          <li
            ref={ref}
            className={
              chat.email === currentUserEmail ? "chat_sent" : "chat_received"
            }
          >
            <div className="profile_message">
              <div className="profile">
                <img src={profile} alt="" />
              </div>
              <div className="message">
                <div className="overall">
                  {chat.message !== undefined && <p>{chat.message}</p>}

                  {chat.likedislike === "liked" && (
                    <img src={thumbsup} alt="" />
                  )}
                </div>
                {chat.image !== undefined && (
                  <img src={chat.image} alt="" className="immg" />
                )}
                {chat.email === currentUserEmail ? (
                  <></>
                ) : (
                  <div className="like_dislike">
                    <button
                      onClick={() => {
                        like(chat.id);
                      }}
                    >
                      <img src={thumbsup} alt="" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        </ul>
      </>
    );
  };

  const GroupMessagesWidget = ({ gChats }) => {
    return (
      <>
        <ul>
          <li
            className={
              gChats.senderEmail === currentUserEmail
                ? "groupChat_sent"
                : "groupChat_received"
            }
          >
            <div className="profile_message">
              <div className="profile">
                <img src={profile} alt="" />
                {gChats.senderEmail !== currentUserEmail && (
                  <div className="name">{gChats.senderName}</div>
                )}
              </div>
              <div className="message">
                <div className="overall">
                  <p>{gChats.text}</p>
                  {gChats.likedislike === "liked" && (
                    <div className="likes">
                      <img src={thumbsup} alt="" />
                      {gChats.numberofLikes > 1 && (
                        <div className="likesNumber">
                          {formatter.format(gChats.numberofLikes)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {gChats.senderEmail !== currentUserEmail && (
                  <div className="like_dislike">
                    <button
                      onClick={() => {
                        like(gChats.id);
                      }}
                    >
                      <img src={thumbsup} alt="" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        </ul>
      </>
    );
  };

  // like feature functionality
  const like = async (uid) => {
    const result = await db
      .collection("groupchats")
      .doc(getGroupUid)
      .collection("chats")
      .doc(uid)
      .collection("likedby")
      .doc(currentUserEmail)
      .get();

    const DeleteLikedBy = async () => {
      await db
        .collection("groupchats")
        .doc(getGroupUid)
        .collection("chats")
        .doc(uid)
        .collection("likedby")
        .doc(currentUserEmail)
        .delete();
    };

    const setUserLiked = async () => {
      await db
        .collection("groupchats")
        .doc(getGroupUid)
        .collection("chats")
        .doc(uid)
        .collection("likedby")
        .doc(currentUserEmail)
        .set({
          name: currentUserEmail,
        });
    };

    friendName
      ? Chats?.docs.map((chaty) => {
          if (uid === chaty?.id) {
            db.collection("chats")
              .doc(getCombinedUid)
              .collection("messages")
              .doc(uid)
              .set(
                {
                  likedislike: "liked",
                },
                { merge: true }
              );
          }
        })
      : groupChat?.docs.map((grpChat) => {
          const details = grpChat?.data();
          if (uid === grpChat?.id) {
            if (
              details.likedislike &&
              details.senderEmail !== currentUserEmail
            ) {
              if (result.exists) {
                db.collection("groupchats")
                  .doc(getGroupUid)
                  .collection("chats")
                  .doc(uid)
                  .set(
                    {
                      numberofLikes: (details.numberofLikes -= 1),
                    },
                    { merge: true }
                  );
                DeleteLikedBy();
                if (details.numberofLikes === 0) {
                  db.collection("groupchats")
                    .doc(getGroupUid)
                    .collection("chats")
                    .doc(uid)
                    .set(
                      {
                        likedislike: deleteField(),
                        numberofLikes: deleteField(),
                      },
                      { merge: true }
                    );
                  DeleteLikedBy();
                }
              } else if (!result.exists) {
                db.collection("groupchats")
                  .doc(getGroupUid)
                  .collection("chats")
                  .doc(uid)
                  .collection("likedby")
                  .doc(currentUserEmail)
                  .set({
                    name: currentUserEmail,
                  });

                db.collection("groupchats")
                  .doc(getGroupUid)
                  .collection("chats")
                  .doc(uid)
                  .set(
                    {
                      numberofLikes: (details.numberofLikes += 1),
                    },
                    { merge: true }
                  );
              }
            } else {
              setUserLiked();
              db.collection("groupchats")
                .doc(getGroupUid)
                .collection("chats")
                .doc(uid)
                .set(
                  {
                    likedislike: "liked",
                    numberofLikes: 1,
                  },
                  { merge: true }
                );
            }
          }
        });
  };

  return (
    <>
      <div className="messages">
        {!friendName
          ? groupChat?.docs.map((groupTexts) => {
              return (
                <>
                  <GroupMessagesWidget
                    gChats={groupTexts?.data()}
                    gId={groupTexts?.id}
                  />
                </>
              );
            })
          : Chats?.docs.map((texts) => {
              return (
                <>
                  <MessageWidget chat={texts?.data()} id={texts?.id} />
                </>
              );
            })}
      </div>
    </>
  );
};

export default Messages;
