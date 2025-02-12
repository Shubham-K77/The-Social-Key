/* eslint-disable no-unused-vars */
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { setUserInfo } from "../../slices/userInfo";
import Navbar from "../components/Navbar";

const UpdateProfile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const theme = useSelector((state) => state.themeToggler.theme);
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: userInfo.name,
    username: userInfo.username,
    email: userInfo.email,
    bio: userInfo.bio,
    profilePic: userInfo.profilePic,
    password: "",
  });

  const handlePic = (picture) => {
    if (picture) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64URL = e.target.result;
        setUser({ ...user, profilePic: base64URL });
        enqueueSnackbar("Image Uploaded Successfully!", { variant: "success" });
      };
      reader.readAsDataURL(picture);
    }
  };

  useEffect(() => {
    const retrieveUser = async () => {
      if (!userInfo || Object.keys(userInfo).length === 0) {
        try {
          const response = await axios.get(
            "https://the-social-key-api.vercel.app/api/v1/users/token",
            { withCredentials: true }
          );
          if (response.data.userInfo) {
            dispatch(setUserInfo(response.data.userInfo));
          }
        } catch (error) {
          const errorMessage = "User is not authenticated.";
          enqueueSnackbar(errorMessage, { variant: "error" });
          navigate("/");
        }
      }
    };
    retrieveUser();

    if (userInfo) {
      setUser({
        name: userInfo.name,
        username: userInfo.username,
        email: userInfo.email,
        bio: userInfo.bio,
        profilePic: userInfo.profilePic,
      });
    }
  }, [navigate, enqueueSnackbar, dispatch, userInfo]);

  const updateData = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        "https://the-social-key-api.vercel.app/api/v1/users/update",
        {
          name: user.name,
          username: user.username,
          password: user.password,
          profilePic: user.profilePic,
          bio: user.bio,
          email: user.email,
        },
        { withCredentials: true }
      );
      enqueueSnackbar(response.data.message, { variant: "success" });
      setLoading(false);
    } catch (error) {
      const errorMessage = error.response.data.message || "Operation Failed!";
      enqueueSnackbar(errorMessage, { variant: "error" });
      setLoading(false);
    }
  };

  const freezeAccount = async () => {
    if (!window.confirm("Do You Want To Freeze Your Account?")) return;
    try {
      const response = await axios.put(
        "https://the-social-key-api.vercel.app/api/v1/users/freeze",
        {},
        { withCredentials: true }
      );
      const successMessage = response.data.message;
      const logout = await axios.post(
        "https://the-social-key-api.vercel.app/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      enqueueSnackbar(logout.data.message, { variant: "success" });
      enqueueSnackbar(successMessage, { variant: "success" });
      navigate("/");
    } catch (error) {
      let message = error.response?.data?.message || "Internal Server Error!";
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex flex-col justify-start items-center ${
        theme === "light"
          ? "text-gray-900 bg-gray-100"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <Navbar />
      <div className="mt-2 w-[90%] h-[185vh] lg:h-[170vh] mb-2 bg-transparent flex justify-center items-center">
        <div className="w-[95%] lg:w-[40%] h-[150vh] bg-transparent rounded-md flex flex-col justify-start items-center">
          <div className="mt-2 mb-[1rem] text-[1.75rem] font-bold">
            User Profile Edit
          </div>
          <div className="w-[95%] lg:w-[80%] h-[22vh] flex justify-around items-center bg-transparent mb-[2rem]">
            <div className="w-[45%] lg:w-[35%] h-[20vh] bg-transparent flex flex-col justify-start items-center">
              <div className="text-[0.95rem] mb-2">Profile Picture</div>
              <div
                className="h-[15vh] w-[75%] lg:w-[70%] rounded-[50%] shadow-md"
                style={{
                  backgroundImage: `url(${
                    user.profilePic || "/Images/avatar.png"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>
            <div
              className="w-[55%] h-[8vh] font-bold flex flex-row justify-center items-center mb-2 hover:cursor-pointer text-[1rem] lg:text-[1.2rem] bg-teal-600 text-white hover:bg-teal-700 rounded-md transition-all ease-in-out duration-200 hover:scale-105"
              onClick={() => fileRef.current.click()}
            >
              Change
              <input
                type="file"
                accept="image/*"
                className="w-[90%] h-[8vh] hidden"
                ref={fileRef}
                onChange={(e) => handlePic(e.target.files[0])}
              />
            </div>
          </div>
          <div className="w-[95%] h-[115vh] bg-transparent mb-[1rem] flex flex-col justify-start items-start">
            <div className="ml-2 font-bold text-[1.15rem] mb-2">Fullname</div>
            <div className="w-[90%] mb-[1rem] ml-[1rem]">
              <input
                type="text"
                className="w-full h-[8vh] rounded-md text-[1.05rem] bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 pl-2"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className="ml-2 font-bold text-[1.15rem] mb-2">Username</div>
            <div className="w-[90%] mb-[1rem] ml-[1rem]">
              <input
                type="text"
                className="w-full h-[8vh] rounded-md text-[1.05rem] bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 pl-2"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>
            <div className="ml-2 font-bold text-[1.15rem] mb-2">Email</div>
            <div className="w-[90%] mb-[1rem] ml-[1rem]">
              <input
                type="text"
                className="w-full h-[8vh] rounded-md text-[1.05rem] bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 pl-2"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="ml-2 font-bold text-[1.15rem] mb-2">Password</div>
            <div className="w-[90%] mb-[1rem] ml-[1rem]">
              <input
                type="password"
                className="w-full h-[8vh] rounded-md text-[1.05rem] bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 pl-2"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <div className="ml-2 font-bold text-[1.15rem] mb-2">Bio</div>
            <div className="w-[90%] mb-[1rem] ml-[1rem]">
              <textarea
                maxLength={100}
                rows={5}
                className="w-full rounded-md text-[1.05rem] bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 p-2 text-justify"
                value={user.bio}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
              />
            </div>
            <div className="w-full flex justify-center items-center text-[1.05rem] mb-2 font-semibold">
              You can unfreeze your account anytime by logging in.
            </div>
            <div
              className="w-[95%] h-[12vh] lg:h-[10vh] bg-red-500 mt-2 mb-4 lg:mb-[2rem] rounded-md shadow-md flex justify-center items-center text-white text-[1.15rem] font-semibold hover:cursor-pointer hover:bg-red-600 transition-all ease-in-out duration-200 hover:scale-105"
              onClick={() => freezeAccount()}
            >
              Freeze Your Account
            </div>
          </div>
          {/* Buttons */}
          <div className="w-[95%] h-[10vh] bg-transparent flex flex-row justify-around items-center mb-4">
            <div
              className="w-[50%] lg:w-[40%] h-[8vh] bg-rose-400 rounded-md font-bold text-[1.05rem] flex justify-center items-center text-black hover:cursor-pointer hover:bg-rose-500 mr-3 lg:mr-0"
              onClick={() => navigate("/update")}
            >
              Cancel
            </div>
            <div
              className={`w-[50%] lg:w-[40%] h-[8vh] bg-sky-500 rounded-md font-bold text-[1.05rem] flex items-center justify-center text-white hover:cursor-pointer hover:bg-sky-600 ${
                loading === true ? "animate-pulse" : ""
              }`}
              onClick={() => updateData()}
            >
              Update
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
