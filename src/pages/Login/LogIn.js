import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../utils/auth";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../Login/LogIn.css";

import PotatoMagni from "images/potato-magnifying-glass.png";
import { auth, db } from "utils/firebase";
import { doc, getDoc } from "@firebase/firestore";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const handleLogIn = async (e) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    try {
      await authService.logIn(email, password);
      const user = authService.getCurrentUser();
      setIsSubmittingLogin(false);

      const userRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        if (docSnap.data().isVerified === false) {
          authService.logOut();
          setError("Admins will verify your information first.");
        } else {
          if (user.emailVerified) {
            // Retrieve the user's role from Firestore
            const role = await authService.getUserRoleFromFirestore(user.uid);

            if (role === "vendor") {
              navigate("/vendor");
            } else if (role === "student") {
              navigate("/student");
            } else {
              navigate("/admin");
            }
          } else {
            setError("Please verify your email first.");
          }
        }
      } else {
        setError("User data not found.");
        authService.logOut();
      }
    } catch (err) {
      setIsSubmittingLogin(false); // Stop loading effect on error
      setError(err.message);
    }
  };

  return (
    <div className="flex bg-gray-100 w-screen h-screen items-center lg:justify-between lg:px-20">
      <div className=" w-full hidden lg:flex justify-center">
        <Image
          src={PotatoMagni}
          alt="Magnifying glass"
          className="w-[500px] h-[500px] hidden lg:block"
        />
      </div>
      <div className="login-form flex flex-col bg-[#F9F2E2] p-5 shadow-md rounded-lg border w-full h-full lg:h-[80%]">
        <div className="lg:hidden flex w-full items-center justify-center">
          <Image
            src={PotatoMagni}
            alt="Magnifying glass"
            className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] block lg:hidden"
          />
        </div>

        <form
          onSubmit={handleLogIn}
          className="flex flex-col w-full h-full justify-center"
        >
          <div className="text-box2 flex justify-center w-full text-[junge] item-center lg:-mt-7 text-[50px] md:text-[100px] lg:text-[120px]">
            WALLET
          </div>
          <div className="text-box3 w-full flex justify-center lg:-mt-10 text-[40px] lg:text-[100px] md:text-[70px]">
            WISE
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex w-full justify-center">
              <input
                className="login-email flex w-[70%] h-[40px] md:h-[50px] text-[15px] md:text-[30px] pl-2"
                type="email"
                placeholder="Enter Username or Email Adress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex w-full justify-center">
              <input
                className="login-password flex w-[70%] md:h-[50px] text-[15px] md:text-[30px] pl-2"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full justify-center text-[Source Code Pro] text-[12px] md:text-[20px] font-bold text-[#ff0000]">
            {error && <p>{error}</p>}
          </div>

          <div className="w-full flex flex-col justify-center items-center">
            {isSubmittingLogin ? (
              <>
                <div className="success-message-login">
                  <h3>"Logging in..." </h3>
                </div>
              </>
            ) : (
              <button
                type="login-submit"
                className="bg-[#f9f2e2] text-black shadow-md rounded-lg border-[10px] border-black flex items-center w-auto px-10 text-[20px] md:text-[20px] transition-all duration-300 ease-in-out hover:bg-rose-300 mt-6 md:h-[50px] text-[source-code-pro] font-semibold"
              >
                LOGIN
              </button>
            )}

            <div className="flex w-full items-center justify-center">
              <button
                onClick={() => navigate("/forgot-password")}
                className="login-forgot-password text-[15px] md:text-2xl"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
