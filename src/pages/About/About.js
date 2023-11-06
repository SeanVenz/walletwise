import { useNavigate } from "react-router-dom";
import Logo from "images/top-logo.png";

import "./About.scss";
import { Image } from "react-bootstrap";
import Adobo from "images/adobo.png";
import BiSolidQuoteAltLeft from "react-icons/bi";

function About() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-[#F9F2E2] w-screen h-screen overflow-x-hidden">
      {/* TOP NAV */}
      <div className="flex flex-row items-center bg-red-400 top-5 h-[80px] justify-between">
        <div
          className="w-[90px] h-[90px] flex items-center justify-center"
          onClick={() => navigate("/")}
        >
          <img src={Logo} alt="Top logo" className="w-full h-full mt-1" />
        </div>

        <div className="flex space-x-4 h-full items-center justify-start mr-5">
          <button
            onClick={() => navigate("/about")}
            className="flex items-center w-auto font-[source-code-pro] h-[50px]"
          >
            About Us
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#f9f2e2] shadow-md rounded-lg border border-rose-300 flex items-center w-auto px-5 text-[15px] lg:text-[20px] transition-all duration-300 ease-in-out hover:bg-rose-300 hover:border-black  h-[50px] font-[source-code-pro]"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-[#f9f2e2] shadow-md rounded-lg border border-rose-300 flex items-center w-auto px-5 text-[15px] lg:text-[20px] transition-all duration-300 ease-in-out hover:bg-rose-300 hover:border-black h-[50px] font-[source-code-pro]"
          >
            Sign Up
          </button>
        </div>
      </div>
      {/* BODY */}
      <div className="flex flex-col items-center justify-between h-full ">
        {/* IMAGES */}
        <div className="w-full h-[auto] justify-between flex">
          <div className="w-full flex justify-end items-center font-[source-code-pro] text-[40px]">
            <q className="w-[700px]">
              Get to know the brilliant minds behind Wallet Wise!
            </q>
          </div>
          <ul className="image-ul w-full h-auto mt-10 mb-10 flex justify-end p-10">
            <li
              className="image-li diamond1 w-[150px] h-[150px] cursor-pointer"
              onClick={() =>
                window.open("https://www.facebook.com/kentstephen.sumalinog/")
              }
            >
              <div className="image"></div>
            </li>
            <li className="image-li diamond2 w-[150px] h-[150px]">
              <div className="image"></div>
            </li>
            <li className="image-li diamond3 w-[150px] h-[150px]">
              <div className="image"></div>
            </li>
            <li className="image-li diamond4 w-[150px] h-[150px]">
              <div className="image"></div>
            </li>
            <li className="image-li diamond5 w-[150px] h-[150px]">
              <div className="image"></div>
            </li>
          </ul>
        </div>
        {/* WALLET WISE */}
        <div className="w-full bg-gray-200 h-[500px] flex">
          <div className="flex flex-1 justify-end items-center pr-5 font-[junge] text-[30px]">
            WALLET WISE
          </div>
          <div className="flex flex-1 pl-5 justify-start ">
            <div className="w-full h-full bg-gray-300 font-[junge] text-[30px] pl-5">
              <div className="w-[70%] h-full flex justify-center items-center">
                Wallet Wise is an online platform for students at Cebu Institute
                of Technology - University for Food Delivery and Market Application
              </div>
            </div>
          </div>
        </div>
        <div>FAQ</div>
        <div className="flex w-full bg-gray-400">Sticky bottom</div>
      </div>
    </div>
  );
}

export default About;
