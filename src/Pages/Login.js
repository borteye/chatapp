import React, { useState } from "react";
import "../static/css/Login.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveUser,
  SelectUid,
  SelectEmail,
  SelectDisplayName,
} from "../features/userSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userUid = useSelector(SelectUid);
  const userEmail = useSelector(SelectEmail);
  const userDisplayName = useSelector(SelectDisplayName);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //navigate to SignUp page
  const register = () => {
    navigate("/sign-up");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userr = userCredential.user;
        dispatch(
          setActiveUser({
            userUid: userr.uid,
            userEmail: userr.email,
            userDisplayName: userr.displayName,
          })
        );
        navigate("/home");
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
            <p>
              Don't have an account?{" "}
              <span
                className="register"
                onClick={() => {
                  register();
                }}
              >
                Register
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
