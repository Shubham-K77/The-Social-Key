/* eslint-disable react/no-unescaped-entities */
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { FaUserFriends } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { LiaAtomSolid } from "react-icons/lia";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";
import { TbMapShare } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { setUserInfo } from "../../slices/userInfo";
const Home = () => {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.themeToggler.theme);
  const dispatch = useDispatch();
  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await axios.get(
        "https://the-social-key-api.vercel.app/api/v1/users/token",
        {
          withCredentials: true, // Ensure credentials are sent with the request
        }
      );
      if (response.data.userInfo) {
        dispatch(setUserInfo(response.data.userInfo));
        navigate("/main");
      }
    };
    checkLoginStatus();
  }, [dispatch, navigate]);
  return (
    <div
      className={`w-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden ${
        theme == "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <Navbar />
      {/* The Hero Section */}
      <div className="w-[100%] h-[100vh] bg-transparent flex flex-col justify-start items-center lg:flex-row lg:justify-around lg:items-center mb-2">
        <div className="w-[95%] h-[40vh] mt-2 lg:w-[35%] lg:h-[80vh] lg:mt-0 bg-transparent flex flex-col justify-center items-start p-2">
          <div className="text-[1.5rem] lg:text-[2rem] font-bold">
            Your Key to Meaningful Social Connections
          </div>
          <div className="text-[0.88rem] lg:text-[1.05rem] mt-2 lg:mt-4 text-justify font-roboto w-full">
            The Social Key connects you with others, helping you share
            experiences, stay updated, and build meaningful relationships in a
            vibrant community.
          </div>
          <div
            className={`w-[60%] lg:w-[50%] h-[9vh] mt-4 rounded-md flex justify-center items-center shadow-md hover:cursor-pointer ${
              theme == "light"
                ? "bg-red-400 hover:bg-red-500"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            id="signup"
            onClick={() => navigate("/signup")}
          >
            <div className="text-[1.5rem] text-center mr-2">
              <FaUserFriends />
            </div>
            <div className="text-[0.90rem] lg:text-[1rem] text-center font-semibold">
              Start Connecting Now
            </div>
          </div>
        </div>
        <div
          className="w-[95%] h-[55vh] lg:w-[35%] lg:h-[80vh] shadow-md rounded-sm"
          style={{
            backgroundImage: `url('/Images/heroBanner.png')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
      {/* The Features Section */}
      <div
        className="w-full h-[55vh] lg:h-[40vh] bg-transparent flex flex-col justify-center items-center lg:flex-row lg:justify-evenly lg:items-center p-2 pb-2 mb-2 border-t-2 border-b-2 border-gray-400 text-justify"
        id="benefits"
      >
        <div className="w-[95%] h-[16vh] lg:w-[30%] lg:h-[35vh] bg-transparent mb-2 lg:mb-0 flex justify-around items-center lg:flex-col lg:items-center lg:justify-center p-2">
          <div className="text-[4rem] lg:text-[5rem] font-bold mr-2">
            <FaHandshake className="animate-bounce" />
          </div>
          <div className="text-justify text-[0.95rem] lg:text-[1.25rem]">
            Build meaningful relationships and engage with like-minded
            individuals easily.
          </div>
        </div>
        <div className="w-[95%] h-[16vh] lg:w-[30%] lg:h-[35vh] bg-transparent mb-2 lg:mb-0 flex justify-around items-center lg:flex-col lg:items-center lg:justify-center p-2">
          <div className="text-[4rem] lg:text-[5rem] font-bold mr-2">
            <IoIosNotifications className="animate-pulse" />
          </div>
          <div className="text-justify text-[0.95rem] lg:text-[1.25rem]">
            Get timely updates and notifications all in one place, Never missing
            out.
          </div>
        </div>
        <div className="w-[95%] h-[16vh] lg:w-[30%] lg:h-[35vh] bg-transparent mb-2 lg:mb-0 flex justify-around items-center lg:flex-col lg:items-center lg:justify-center p-2">
          <div className="text-[4rem] lg:text-[5rem] font-bold mr-2">
            <LiaAtomSolid className="animate-spin" />
          </div>
          <div className="text-justify text-[0.95rem] lg:text-[1.25rem]">
            Enjoy a seamless and user-friendly interface that makes navigation
            easy and enjoyable.
          </div>
        </div>
      </div>
      {/* The Social Section */}
      <div
        className="w-[95%] h-[250vh] lg:h-[100vh] bg-transparent mb-4 flex flex-col justify-evenly items-center lg:flex-row lg:justify-evenly lg:items-center"
        id="features"
      >
        <div className="w-[90%] lg:w-[20%] flex-col justify-around items-center">
          <div
            className="relative group w-full h-[50vh] shadow-md lg:h-[80vh] font-dancing rounded-md flex justify-center items-center mb-2 transition-transform ease-in-out duration-300 hover:scale-95 hover:cursor-pointer"
            style={{
              backgroundImage: `url(/Images/Image-3.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 w-full bg-slate-900 bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 rounded-md"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 flex justify-center items-center text-justify p-2 lg:p-4">
              <div className="font-roboto text-[1.05rem] lg:text-[1.05rem] text-white">
                The Social Key fosters a vibrant community by allowing users to
                connect, share posts, and engage with like-minded individuals,
                creating a sense of belonging.
              </div>
            </div>
          </div>
          <div className="font-bold text-[1.5rem] text-center">Community</div>
        </div>
        <div className="w-[90%] lg:w-[60%] h-[120vh] lg:h-[90vh] flex flex-col justify-evenly lg:justify-around items-center">
          <div className="w-full lg:w-[50%] flex flex-col justify-around items-center mb-2">
            <div
              className="relative group w-full h-[50vh] lg:h-[35vh] font-dancing rounded-md flex justify-center items-center mb-2 shadow-md transition-transform ease-in-out duration-300 hover:scale-105 hover:bg-opacity-0 hover:cursor-pointer"
              style={{
                backgroundImage: `url(/Images/Image-1.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Overlay for Background Opacity on Hover */}
              <div className="absolute inset-0 bg-slate-900 bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 rounded-md"></div>
              {/* The Appearing Text */}
              <div className="absolute w-[75%] text-justify flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300">
                <div className="font-roboto text-[0.95rem] text-gray-100">
                  With tools like Text-to-Image and Text-to-Speech powered by
                  Hugging Face AI models, users can express themselves in unique
                  and imaginative ways.
                </div>
              </div>
            </div>
            <div className="font-bold text-[1.5rem] text-center">
              Creativity
            </div>
          </div>
          <div className="w-full lg:w-[50%] flex flex-col justify-around items-center">
            <div
              className="relative group w-full h-[50vh] lg:h-[35vh] font-dancing rounded-md flex justify-center items-center mb-2 shadow-md transition-transform ease-in-out duration-300 hover:scale-105 hover:bg-opacity-0 hover:cursor-pointer"
              style={{
                backgroundImage: `url(/Images/Image-4.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Overlay for Background Opacity on Hover */}
              <div className="absolute inset-0 bg-slate-900 bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 rounded-md"></div>
              {/* The Appearing Text */}
              <div className="absolute w-[75%] text-justify flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300">
                <div className="font-roboto text-[0.95rem] text-gray-100">
                  Real-time chat features enable seamless communication,
                  supporting both individual and group conversations for staying
                  connected effortlessly.
                </div>
              </div>
            </div>
            <div className="font-bold text-[1.5rem] text-center">Messaging</div>
          </div>
        </div>
        <div className="w-[90%] lg:w-[20%] flex-col justify-around items-center">
          <div
            className="relative group w-full h-[50vh] shadow-md lg:h-[80vh] font-dancing rounded-md flex justify-center items-center mb-2 transition-transform ease-in-out duration-300 hover:scale-95 hover:cursor-pointer"
            style={{
              backgroundImage: `url(/Images/Image-2.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 w-full bg-slate-900 bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 rounded-md"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 flex justify-center items-center text-justify p-2 lg:p-4">
              <div className="font-roboto text-[1.05rem] lg:text-[1.05rem] text-white">
                Stay informed about upcoming events and activities through
                personalized notifications, ensuring users never miss important
                moments.
              </div>
            </div>
          </div>
          <div className="font-bold text-[1.5rem] text-center">Events</div>
        </div>
      </div>
      {/* The Information Section */}
      <div className="p-2 w-full h-[150vh] lg:h-[100vh] flex  flex-col justify-evenly items-center lg:flex-row lg:justify-around lg:items-center bg-transparent border-t-2 border-slate-400 mb-[2rem]">
        <div className="w-[90%] h-[70vh] lg:w-[35%] lg:h-[90vh] bg-transparent flex flex-col justify-evenly lg:justify-center items-start p-2 mb-[2rem]">
          <div className="text-[1.75rem] font-bold mb-2 lg:mb-[1rem]">
            Privacy, Innovation, and Purpose
          </div>
          <div className="text-[0.90rem] lg:text-[1rem] font-roboto text-justify mb-2 lg:mb-[1.5rem]">
            Your privacy is our priority—The Social Key ensures all user
            information is securely encrypted with the Blowfish cipher, and
            email verification is mandatory for account creation. Leveraging
            Hugging Face AI models, the platform enhances user experience with
            Text-to-Speech and Text-to-Image features. Inspired by elephants, a
            global symbol of connection, wisdom, and community, the mascot
            represents the platform's commitment to fostering meaningful
            relationships in a safe, innovative environment.
          </div>
          <div
            className={`w-[70%] lg:w-[50%] h-[9vh] rounded-md flex justify-center items-center hover:cursor-pointer ${
              theme === "light"
                ? "bg-amber-400 hover:bg-amber-500"
                : "bg-green-500 hover:bg-green-600"
            }`}
            id="login"
            onClick={() => navigate("/login")}
          >
            <div className="text-[1.5rem] mr-2">
              <FaUnlockKeyhole />
            </div>
            <div className="text-[1.1rem] font-bold">Access Your Account</div>
          </div>
        </div>
        <div
          className="relative group w-[90%] h-[70vh] lg:w-[40%] lg:h-[85vh] shadow-md rounded-md transition-transform ease-in-out duration-300 hover:scale-105 flex justify-center items-center hover:cursor-pointer"
          style={{
            backgroundImage: `url(/Images/Image-5.jpg)`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 w-full bg-slate-900 bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 rounded-md"></div>
          <div className="absolute inset-0 p-4 flex justify-center items-center text-justify opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 text-white">
            <div className="text-[1rem] font-roboto">
              Elephants were chosen as the symbol for The Social Key because
              they closely resemble human society, known for their strong social
              bonds and deep empathy. Elephants mourn the loss of their loved
              ones and celebrate joy with the same intensity, reflecting the
              deep emotional connections within a community. Just like
              elephants, our platform values connection, support, and shared
              experiences, symbolizing a community that thrives on cooperation,
              care, and unity.
            </div>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="mt-2 border-t-2 border-slate-400 m-2 w-full flex flex-col justify-evenly items-center h-[108vh] lg:h-[60vh] bg-transparent">
        <div className="w-full h-[92vh] lg:h-[50vh] flex flex-col justify-start items-center lg:flex-row lg:justify-evenly lg:items-center bg-transparent">
          <div className="w-[80%] h-[32vh] lg:w-[30%] lg:h-[48vh] bg-transparent flex flex-col justify-start lg:justify-center items-center p-2 mb-2 lg:mb-0">
            <div className="mt-2 mb-2 text-[1.5rem] font-openSans font-bold text-center border-b-2 border-slate-400 lg:border-0">
              Contact Information
            </div>
            <div className="mb-2 lg:text-[1.05rem] text-[0.95rem] flex justify-around items-center">
              <div className="text-[1rem] font-bold">
                <MdAlternateEmail className="animate-pulse" />
              </div>
              <div className="text-[1rem] font-bold">
                : theSocialKey@gmail.com
              </div>
            </div>
            <div className="mb-2 lg:text-[1.05rem] text-[0.95rem] flex justify-around items-center">
              <div className="text-[1rem] font-bold">
                <FaPhoneVolume className="animate-bounce" />
              </div>
              <div className="text-[1rem] font-bold">: +977-9801234567</div>
            </div>
            <div className="mb-2 lg:text-[1.05rem] text-[0.95rem] flex justify-around items-center text-center">
              <div className="text-[1rem] font-bold mb-4 lg:mb-0 ml-2 lg:ml-0">
                <TbMapShare className="animate-ping" />
              </div>
              <div className="text-[1rem] font-bold">
                : New Baneshwor, Kathmandu 44600, Nepal
              </div>
            </div>
          </div>
          <div className="w-[80%] h-[32vh] lg:w-[30%] lg:h-[48vh] flex flex-col justify-center items-center bg-transparent mb-2 lg:mb-0">
            <div
              className="w-[90%] h-[20vh] lg:h-[40vh]"
              style={{
                backgroundImage: `${
                  theme === "light"
                    ? `url('/Images/logoSun.png')`
                    : `url('/Images/logoMoon.png')`
                }`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="text-[2rem] text-center font-bold">
              The Social Key
            </div>
          </div>
          <div className="w-[80%] h-[32vh] lg:w-[30%] lg:h-[48vh] bg-transparent flex flex-col justify-start lg:justify-center items-center">
            <div className="text-[1.5rem] font-bold text-center mt-2 mb-2 border-b-2 border-slate-400 lg:border-0">
              Quick Links
            </div>
            <div className="text-[1.05rem] font-bold font-openSans text-decoration-none underline mb-2">
              <a href="#login"> Login </a>
            </div>
            <div className="text-[1.05rem] font-bold font-openSans text-decoration-none underline mb-2">
              <a href="#signup"> Signup </a>
            </div>
            <div className="text-[1.05rem] font-bold font-openSans text-decoration-none underline mb-2">
              <a href="#benefits"> Benefits </a>
            </div>
            <div className="text-[1.05rem] font-bold font-openSans text-decoration-none underline mb-2">
              <a href="#features"> Features </a>
            </div>
          </div>
        </div>
        <div className="w-full h-[18vh] lg:h-[8vh] bg-transparent flex justify-center items-center mt-2 border-t-2 border-slate-400">
          <div className="text-[1.05rem] font-copyRight font-semibold text-center">
            &copy; 2025. The Social Key. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
