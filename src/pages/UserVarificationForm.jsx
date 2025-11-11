import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import bgImg from '../assets/images/verification-bg.png'
import { Route, Routes, Navigate } from "react-router-dom";

export default function UserVarificationForm(props) {
  const [isLoginSection, setLoginSection] = useState(true);

  return (
    <>
      <div className="form-container fixed w-[100vw] h-[100vh] top-0 left-0 z-99 min-h-screen bg-white text-gray-900 ">
        <div className="flex flex-col items-center justify-center min-h-screen bg-white/50">
          <img
            className="absolute w-[100vw] h-[100vh] -z-50"
            src={bgImg}
            alt="background image"
          />
          <div className="w-96 border border-gray-300 bg-white p-8 rounded-2xl">

            <Routes>
              <Route
                path="login"
                element={
                  <LoginForm
                    setLoginSection={setLoginSection}
                    navigate={props.navigate}
                  />
                }
              />

              <Route
                path="verify"
                element={
                  <SignupForm
                    setLoginSection={setLoginSection}
                    userImageSrc={props.userImageSrc}
                    setUserImageSrc={props.setUserImageSrc}
                    navigate={props.navigate}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </>

  );
}
