import React, { useState } from "react";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <>
      <div className="login">
        <div className="container">
          <div className="content">
            <div className="title">
              <p className="header">Rea Chat</p>
              <p className="sub_header">
                <span className="head">Login</span> to continue...
              </p>
            </div>
            <form onSubmit={handleSignIn}>
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
              <button type="submit">Sign in</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
