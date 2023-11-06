import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../../images/logo.png";
import { BsList } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
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
              onClick={() => navigate("/admin/students")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{ textDecoration: "none", color: "black", width: "100%" }}
            >
              <div className="student-side-category font-semibold">Students</div>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/admin/vendors")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{ textDecoration: "none", color: "black", width: "100%" }}
            >
              <div className="student-side-category font-semibold">Vendors</div>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/admin/history")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{ textDecoration: "none", color: "black", width: "100%", textAlign: "center" }}
            >
              <div className="student-side-category font-semibold">Orders History</div>
            </div>
          </li>
        </ul>
        <Outlet />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden absolute p-5 mt-4 bg-transparent h-10">
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
                onClick={() => navigate("/admin/students")}
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
                  Student
                </div>
              </div>
            </li>
            <li>
              <div
                onClick={() => navigate("/admin/vendors")}
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
                  Vendors
                </div>
              </div>
            </li>
            <li>
              <div
                onClick={() => navigate("/admin/history")}
                activeStyle={{
                  fontWeight: "bold",
                  backgroundColor: "white", // Background color on click
                  color: "black", // Text color on click
                }}
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                  textAlign: "center"
                }}
              >
                <div className="student-side-category font-semibold">
                  Orders History
                </div>
              </div>
            </li>
          </ul>
          <Outlet />
        </motion.div>
      )}
    </div>
  );
};

export default AdminSidebar;
