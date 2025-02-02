/* eslint-disable react/no-unescaped-entities */
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { setUserInfo } from "../../slices/userInfo";
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useSelector((state) => state.themeToggler.theme);
  const navigate = useNavigate();
  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await axios.get(
        "http://localhost:5555/api/v1/users/token",
        {
          withCredentials: true,
        }
      );
      if (response.data.userInfo) {
        dispatch(setUserInfo(response.data.userInfo));
        navigate("/main");
      }
    };
    checkLoginStatus();
  }, [dispatch, navigate]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      let response = await axios.post(
        "http://localhost:5555/api/v1/users/login",
        { username, password },
        { withCredentials: true }
      );
      enqueueSnackbar(response.data.message, { variant: "success" });
      response = await axios.get("http://localhost:5555/api/v1/users/token", {
        withCredentials: true,
      });
      dispatch(setUserInfo(response.data.userInfo));
      setUsername("");
      setPassword("");
      setLoading(false);
      navigate("/main");
    } catch (error) {
      const errorMessage =
        error.response.data.message || "An Unexpected error has occurred!";
      enqueueSnackbar(errorMessage, { variant: "error" });
      setLoading(false);
    }
  };
  return (
    <div
      className={`w-full min-h-screen flex flex-col justify-start items-center ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <Navbar />
      <div className="w-[95%] h-[200vh] lg:h-[150vh] p-2 bg-transparent mb-2 flex flex-col justify-evenly items-center lg:flex-row lg:justify-around lg:items-center">
        <div
          className="w-[95%] h-[80vh] lg:w-[38%] lg:h-[135vh] rounded-sm"
          style={{
            backgroundImage: `url('/Images/login.png')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="w-full h-[100vh] lg:w-[50%] lg:h-[120vh] bg-transparent flex flex-col justify-start items-center">
          <div className="w-full lg:w-[90%] h-[25vh] bg-transparent mt-[2rem] flex flex-col justify-center items-center">
            <div className="text-[2.5rem] font-bold mb-2">Welcome Back</div>
            <div className="text-[1rem] ml-3 lg:ml-0">
              Enter your username and password to access your account
            </div>
          </div>
          <div className="w-[90%] h-[80vh] bg-transparent mt-[2rem] flex flex-col justify-start items-start">
            <div className="text-[1.10rem] lg:text-[1.05rem] font-bold mt-2 mb-2 lg:ml-[1rem] font-roboto">
              Username
            </div>
            <div className="w-[95%] lg:w-[80%] mb-[1.5rem] lg:ml-[1rem] font-openSans">
              <input
                type="text"
                value={username}
                className="w-full h-[7vh] text-[0.90rem] font-bold rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-transparent"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="text-[1.10rem] lg:text-[1.05rem] font-bold mt-2 mb-2 lg:ml-[1rem] font-roboto">
              Password
            </div>
            <div className="w-[95%] lg:w-[80%] mb-[4rem] lg:ml-[1rem] font-openSans">
              <input
                type="password"
                value={password}
                className="w-full h-[7vh] text-[0.90rem] font-bold rounded-md p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div
              className={`w-[98%] lg:w-[90%] h-[8.5vh] rounded-md shadow-md text-[1.25rem] font-bold lg:ml-[2rem] flex justify-center items-center transition-all ease-in-out duration-200 hover:scale-105 ${
                theme === "light"
                  ? "bg-rose-400 text-black hover:bg-rose-500 hover:cursor-pointer"
                  : "bg-sky-400 text-white hover:bg-sky-500 hover:cursor-pointer"
              } ${loading === true ? "animate-pulse" : ""}`}
              onClick={() => handleLogin()}
            >
              Login
            </div>
          </div>
          <div className="w-[90%] h-[10vh] bg-transparent mt-[2rem] flex justify-center items-center">
            <div className="mr-2 text-[1rem]">Don't have an account?</div>
            <div
              className="font-bold text-[1.05rem] hover:cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
