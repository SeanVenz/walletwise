import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../../images/logo.png";
import { BsList } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";

import "./index.css";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [states, setStates] = useState({
    scrollY: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setStates((prev) => ({ ...prev, scrollY: window.scrollY }));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div
        style={{
          top: 0,
          left: 0,
          height: "100vh",
          width: "300px",
          background: "#f8b4b4",
          alignItems: "center",
          flexDirection: "column",
          position: "sticky",
          zIndex: "1",
          paddingLeft: "20px",
          fontSize: "3rem",
        }}
        className="lg:flex hidden"
      >
        <img
          src={Logo}
          width={100}
          height={100}
          alt="logo"
          className="h-[150px] w-[150px] "
        />
        <ul className="student-side-ul gap-10">
          <li>
            <div
              onClick={() => navigate("/student/market")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{
                textDecoration: "none",
                color: "black",
                width: "100%",
              }}
            >
              <div className="student-side-category font-semibold">Market</div>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/student/orders")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{ textDecoration: "none", color: "black", width: "100%" }}
            >
              <div className="student-side-category font-semibold">Orders</div>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/student/profile")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{ textDecoration: "none", color: "black", width: "100%" }}
            >
              <div className="student-side-category font-semibold">Profile</div>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/student/cart")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{ textDecoration: "none", color: "black", width: "100%" }}
            >
              <div className="student-side-category font-semibold">Cart</div>
            </div>
          </li>
        </ul>
        <Outlet />
      </div>

      {/* MOBILE */}
      <div
        className={`lg:hidden w-full absolute p-5 mt-4 z-10 h-10 ${
          states.scrollY !== 0 ? "bg-[#f8b4b4] !important" : "bg-transparent"
        }`}
      >
        <button className="flex text-[30px]" onClick={() => setIsVisible(true)}>
          <BsList />
        </button>
      </div>
      {isVisible && (
        <motion.div
          key={isVisible}
          className="bg-[#f8b4b4] left-0 absolute h-full z-10 w-[80%] flex flex-col"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          exit={{ x: 20, opacity: 0 }}
        >
          <div className="w-full flex items-start justify-end h-auto">
            <button
              onClick={() => setIsVisible(false)}
              className="text-[20px] p-3"
            >
              <AiOutlineClose />
            </button>
          </div>
          <div className="w-full flex justify-center">
            <img
              src={Logo}
              width={100}
              height={100}
              alt="logo"
              className="h-[150px] w-[150px] "
            />
          </div>
          <ul className="student-side-ul gap-10">
            <li>
              <div
                onClick={() => navigate("/student/market")}
                activeStyle={{
                  fontWeight: "bold",
                  backgroundColor: "white",
                  color: "black",
                }}
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                }}
              >
                <div className="student-side-category font-semibold">
                  Market
                </div>
              </div>
            </li>
            <li>
              <div
                onClick={() => navigate("/student/orders")}
                activeStyle={{
                  fontWeight: "bold",
                  backgroundColor: "white", // Background color on click
                  color: "black", // Text color on click
                }}
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                }}
              >
                <div className="student-side-category font-semibold">
                  Orders
                </div>
              </div>
            </li>
            <li>
              <div
                onClick={() => navigate("/student/profile")}
                activeStyle={{
                  fontWeight: "bold",
                  backgroundColor: "white", // Background color on click
                  color: "black", // Text color on click
                }}
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                }}
              >
                <div className="student-side-category font-semibold">
                  Profile
                </div>
              </div>
            </li>
            <li>
              <div
                onClick={() => navigate("/student/cart")}
                activeStyle={{
                  fontWeight: "bold",
                  backgroundColor: "white", // Background color on click
                  color: "black", // Text color on click
                }}
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                }}
              >
                <div className="student-side-category font-semibold">Cart</div>
              </div>
            </li>
          </ul>
          <Outlet />
        </motion.div>
      )}
    </div>
  );
};

export default StudentSidebar;
