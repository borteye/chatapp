import React, { useState } from "react";
import uuid from "react-uuid";
import send from "../static/Assets/send1.svg";
import imageUpload from "../static/Assets/pictureUpload.svg";
import { storage } from "../FConfig";
import db from "../FConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { SelectEmail, SelectDisplayName } from "../features/userSlice";
import {
  SelectFriendName,
  SelectCombinedId,
  SelectGroupName,
  SelectGroupId,
} from "../features/selectChatSlice";
import { useSelector } from "react-redux";
import firebase from "firebase/compat/app";

const SendMessage = () => {
  const [text, setText] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [progress, setProgress] = useState("");

  const userDisplayName = useSelector(SelectDisplayName);
  const userEmail = useSelector(SelectEmail);

  const friendsName = useSelector(SelectFriendName);
  const combinedId = useSelector(SelectCombinedId);
  const groupsName = useSelector(SelectGroupName);
  const groupId = useSelector(SelectGroupId);

  const uniqueId = uuid();

  //handle onChange
  const handleImageChange = (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    loadImage(file);
  };

  //load selected file into variable
  const loadImage = (file) => {
    if (!file) return;

    const StorageRef = ref(storage, `/files/${file.name}`);

    const uploadTask = uploadBytesResumable(StorageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // The loading  variable is the time it takes to upload the file to firebase from 0 to 100%. You can display it on front end.
        const loading = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // create a progress variable and set loading to it.
        setProgress(loading);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          //This is the file or image  url
          setImageURL(url);
        });
      }
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!friendsName) {
      if (text === "" && imageURL !== "") {
        db.collection("groupchats")
          .doc(groupId)
          .collection("chats")
          .doc(uniqueId)
          .set(
            {
              image: imageURL,
              senderName: userDisplayName,
              senderEmail: userEmail,
              id: uniqueId,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
      } else if (imageURL === "" && text !== "") {
        db.collection("groupchats")
          .doc(groupId)
          .collection("chats")
          .doc(uniqueId)
          .set(
            {
              message: text,
              senderName: userDisplayName,
              senderEmail: userEmail,
              id: uniqueId,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
      } else if (text !== "" && imageURL !== "") {
        db.collection("groupchats")
          .doc(groupId)
          .collection("chats")
          .doc(uniqueId)
          .set(
            {
              message: text,
              image: imageURL,
              senderName: userDisplayName,
              senderEmail: userEmail,
              id: uniqueId,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
      }
    } else if (!groupsName) {
      if (text === "" && imageURL !== "") {
        db.collection("chats")
          .doc(combinedId)
          .collection("messages")
          .doc(uniqueId)
          .set(
            {
              image: imageURL,
              email: userEmail,
              id: uniqueId,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
      } else if (imageURL === "" && text !== "") {
        db.collection("chats")
          .doc(combinedId)
          .collection("messages")
          .doc(uniqueId)
          .set(
            {
              message: text,
              email: userEmail,
              id: uniqueId,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
      } else if (text !== "" && imageURL !== "") {
        db.collection("chats")
          .doc(combinedId)
          .collection("messages")
          .doc(uniqueId)
          .set(
            {
              message: text,
              image: imageURL,
              email: userEmail,
              id: uniqueId,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
      }
    }
    setText("");
    setImageURL("");
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          handleSendMessage(e);
        }}
      >
        <div className="text">
          <input
            type="text"
            placeholder="Type your message here.."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </div>
        <div className="image_btn">
          <div className="image">
            <input
              type="file"
              id="image"
              className="img"
              onChange={handleImageChange}
            />
            <label htmlFor="image">
              <img src={imageUpload} alt="" />
            </label>
          </div>
          <div className="sBtn">
            <button type="submit">
              <img src={send} alt="" />
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SendMessage;
