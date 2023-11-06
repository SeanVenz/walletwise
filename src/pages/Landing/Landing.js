import { Link, useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";

import TitlePotato from "images/big-potato.png";
import Logo from "images/top-logo.png";
import Lumpia from "images/lumpia.png";
import Adobo from "images/adobo.png";
import Ginabot from "images/ginabot.png";
import Siomai from "images/siomai.png";
import Chicken from "images/chicken.png";

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-[#F9F2E2] w-screen h-screen">
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
      <div className="flex flex-col justify-center items-center h-full ">
        <div className="flex items-center lg:mt-0 justify-center lg:w-full w-full">
          <Image
            src={TitlePotato}
            alt="titlePpotato"
            className="flex w-auto h-[100px] md:h-[200px] lg:h-[320px]"
          />
          <div className="flex flex-col justify-center items-center md:gap-[30px] lg:gap-[70px] md:mb-5">
            <div className="text-box1 flex text-[15px] md:text-[30px] lg:text-[45px] font-[junge]">
              Welcome to
            </div>
            <div className="font-[julius] text-3xl md:text-[70px] lg:text-[140px] tracking-[0.2em]">
              WALLET
            </div>
            <div className="font-[Monoton] text-2xl md:text-[50px] lg:text-[100px]">
              WISE
            </div>
          </div>
          <Image
            src={TitlePotato}
            alt="titlePotato"
            className="flex w-auto h-[100px] md:h-[200px] lg:h-[320px]"
          />
        </div>

        <div className="h-auto w-full flex flex-wrap py-10 md:px-[100px] justify-center items-center gap-3 md:gap-5 lg:gap-10">
          <div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]">
            <Image
              src={Lumpia}
              alt="Lumpia"
              className="w-full h-full rounded-[50%] border-[2px] border-black object-cover"
            />
          </div>
          <div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]">
            <Image
              src={Adobo}
              alt="Adobo"
              className="w-full h-full rounded-[50%] border-[2px] border-black object-cover"
            />
          </div>
          <div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]">
            <Image
              src={Ginabot}
              alt="Ginabot"
              className="w-full h-full rounded-[50%] border-[2px] border-black object-cover"
            />
          </div>
          <div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]">
            <Image
              src={Siomai}
              alt="Siomai"
              className="w-full h-full rounded-[50%] border-[2px] border-black object-cover"
            />
          </div>
          <div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]">
            <Image
              src={Chicken}
              alt="Chicken"
              className="w-full h-full rounded-[50%] border-[2px] border-black object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
