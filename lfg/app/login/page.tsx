"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeIcon } from "@/components/ThemeIcon";

export default function Login() {
   const router = useRouter();

   const [loginInput, setLoginInput] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

   const handleLogin = () => {};
   const handleForgotPass = () => {};
   const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {};

   return (
      <div className="background-cover">
         <div className="login-signup-container" onKeyDown={handleKeyPress}>
            {/*************************************************************

                    Login Form inputs

                *************************************************************/}
            <div className="login-form column">
               <h2>Log In</h2>
               <div className="error">{error}</div>
               <div className="login-form-inputs">
                  <input
                     className="login-input"
                     type="text"
                     placeholder="Username or e-mail"
                     value={loginInput}
                     onChange={(e) => setLoginInput(e.target.value)}
                  />
                  <input
                     className="login-input"
                     type="password"
                     placeholder="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
                  <button id="forgot-password" onClick={handleForgotPass}>
                     Forgot Password
                  </button>

                  <div className="mobile-signup">
                     <p>No account? </p>
                     <p id="signup-btn-mobile" onClick={() => router.push("/signup")}>
                        Sign Up
                     </p>
                  </div>
               </div>
               <button id="main-loginsignup-btn" onClick={handleLogin}>
                  Log In
               </button>
            </div>
            {/*************************************************************

                    Welcome Directory

                *************************************************************/}
            <div className="directory column">
               {/* <h1>Welcome!</h1>
                    <p>Don't have an account?</p> */}
               <ThemeIcon
                  light={"assets/bannerImages/login_light.png"}
                  dark={"assets/bannerImages/login_dark.png"}
               />
               <button onClick={() => router.push("/signup")}>Sign Up</button>
            </div>
         </div>
      </div>
   );
}
