import React, { useState } from "react";
import uuid from "react-uuid";
import send from "../../Assets/send1.svg";
import imageUpload from "../../Assets/pictureUpload.svg";
import { handleSendMessage } from "../../Functionalities/Functionality";
import { storage } from "../../FConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const SendMessage = ({ getCombinedUid, currentUserEmail }) => {
  const [text, setText] = useState();
  const [imageURL, setImageURL] = useState();
  const [progress, setProgress] = useState();

  const uniqueId = uuid();

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

  //handle onChange
  const handleImageChange = (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    loadImage(file);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          handleSendMessage(
            e,
            text,
            setText,
            getCombinedUid,
            currentUserEmail,
            uniqueId,
            imageURL,
            setImageURL
          );
          console.log(imageURL); /// console log this
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
