import React, { useState } from "react";
import "../static/css/SignUp.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../FConfig";
import { useNavigate } from "react-router-dom";
import db from "../FConfig";
import firebase from "firebase/compat/app";

const SignUp = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  //navigate to login Page
  const signin = () => {
    navigate("/");
  };

  //add user to firebase
  async function createUserFirestore(user) {
    await db.collection("users").doc(user.uid).set({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      email: user.email,
      name: username,
    });
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        updateProfile(user, {
          displayName: username,
        });
        createUserFirestore(user);

        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <>
      <div className="signup">
        <div className="container">
          <div className="content">
            <div className="title">
              <p className="header">Rea Chat</p>
              <p className="sub_header">
                <span className="head">Register</span> to get started...
              </p>
            </div>
            <form onSubmit={handleRegister}>
              <div className="username">
                <label>username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="email">
                <label>email</label>
                <input
                  type="email"
                  vaule={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="password">
                <label>password</label>
                <input
                  type="text"
                  vaule={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <button type="submit">Register</button>
            </form>
            <p>
              Already have an account?{" "}
              <span
                className="logging"
                onClick={() => {
                  signin();
                }}
              >
                Login
              </span>{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
