/* eslint-disable react/prop-types */

import { useSelector } from "react-redux";
import { IoLinkSharp } from "react-icons/io5";
import { IoQrCodeOutline } from "react-icons/io5";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ProfileHead = ({ userProfileData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { username } = useParams();
  const [qr, setQR] = useState(false);
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const activeUser = useSelector((state) => state.user.userInfo);
  const [following, setFollowing] = useState();
  const theme = useSelector((state) => state.themeToggler.theme);
  useEffect(() => {
    if (Object.keys(activeUser).length < 1) {
      setFollowing(false);
    } else {
      setFollowing(
        activeUser?.following.includes(userProfileData?._id) ? true : false
      );
    }
  }, [activeUser, userProfileData]);
  const fetchQrCode = async () => {
    try {
      const currentUrl = window.location.href;
      const response = await axios.post(
        "http://localhost:5555/api/v1/users/qrCode",
        {
          currentUrl,
          username: userProfileData?.username || username,
          type: "profile",
        }
      );
      setUrl(response.data.url);
      if (qr == false) {
        setQR(true);
        enqueueSnackbar("QR Generated!", { variant: "success" });
      } else {
        setQR(false);
      }
    } catch (error) {
      const errorMessage =
        error.response.data.message || "QR Generation Failed!";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };
  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    enqueueSnackbar("Profile Link Copied To Clipboard!", {
      variant: "success",
    });
  };
  const handleFollowUnfollow = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5555/api/v1/users/follow/${userProfileData?._id}`,
        {},
        { withCredentials: true }
      );
      setFollowing(following === true ? false : true);
      enqueueSnackbar(response.data.message, { variant: "success" });
      if (following) {
        userProfileData?.followers.pop();
      } else {
        userProfileData?.followers.push(activeUser?._id);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Operation Failed!";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };
  return (
    <div
      className={`w-full h-[80vh] bg-transparent flex flex-col justify-start items-start overflow-x-hidden ${
        theme === "light" ? "text-gray-900" : "text-gray-100"
      }`}
    >
      <div className="w-full h-[32vh] bg-transparent flex justify-around items-center">
        <div className="w-full flex flex-col justify-start items-start">
          <div className="text-[1.75rem] lg:text-[2.5rem] pl-4 font-bold mb-2 lg:mb-0">
            {userProfileData?.name}
          </div>
          <div className="flex justify-start items-center">
            <div className="font-openSans text-[0.95rem] pl-4">
              {userProfileData?.username}
            </div>
            <div className="bg-amber-800 text-[0.60rem] lg:text-[0.75rem] text-white p-2 ml-2 font-bold rounded-md shadow-md">
              The Social Key
            </div>
          </div>
        </div>
        <div
          className="w-[58%] h-[18vh] lg:w-[26%] lg:h-[20vh] rounded-[50%] mr-2 shadow-md"
          style={{
            backgroundImage: `url('${
              userProfileData?.profilePic || "/Images/avatar.png"
            }')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
      <div className="w-full bg-transparent flex justify-start items-start p-2">
        <div className="text-[0.90rem] lg:text-[1.05rem] text-justify">
          {userProfileData?.bio}
        </div>
      </div>
      <div className="w-full bg-transparent flex flex-col justify-start items-start lg:flex-row lg:justify-around lg:items-center mb-2">
        <div className="w-[95%] lg:w-[60%] flex justify-start items-center">
          <div className="font-openSans text-[0.95rem] lg:text-[1rem] font-light ml-2 pt-2">
            {userProfileData?.followers?.length || 0} Followers
          </div>
          <div className="font-openSans text-[0.98rem] lg:text-[1.15rem] font-extrabold ml-2">
            .
          </div>
          <div className="font-openSans text-[0.95rem] lg:text-[1.05rem] font-light ml-2 pt-2">
            theSocialKey.vercel.app
          </div>
        </div>
        <div className="w-[95%] lg:w-[40%] bg-transparent flex flex-row justify-around lg:justify-evenly items-center">
          <div
            className="h-[18vh] p-2 lg:p-0 w-[40%] lg:h-[15vh] flex flex-col items-center justify-center hover:cursor-pointer"
            onClick={fetchQrCode}
          >
            {qr == false ? (
              <IoQrCodeOutline
                className="text-[2.5rem] font-bold hover:animate-pulse hover:text-green-700"
                title="QR Code"
              />
            ) : (
              <div
                className="w-[90%] lg:w-full h-[15vh]"
                style={{
                  backgroundImage: `url(${url})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            )}
          </div>
          <div
            className="w-[40%] h-[15vh] flex flex-col items-center justify-center hover:cursor-pointer"
            onClick={copyUrl}
          >
            <IoLinkSharp
              className="text-[2.5rem] font-bold hover:animate-pulse hover:text-amber-700"
              title="Copy Link"
            />
          </div>
        </div>
      </div>
      <div
        className={
          "w-[45%] lg:w-[35%] h-[18vh] bg-transparent flex justify-left items-center"
        }
      >
        {userProfileData?._id === activeUser._id ? null : (
          <div
            className={
              "w-full ml-2 lg:ml-0 h-[8vh] font-bold text-[1.05rem] bg-sky-500 rounded-md shadow-md flex justify-center items-center text-white hover:bg-sky-600 hover:cursor-pointer"
            }
            onClick={() => handleFollowUnfollow()}
          >
            {following === false ? "Follow" : "Unfollow"}
          </div>
        )}
        {userProfileData?._id === activeUser._id ? (
          <div
            className={
              "w-full h-[8vh] font-bold text-[1.05rem] bg-teal-600 rounded-md shadow-md flex justify-center items-center text-white hover:cursor-pointer hover:bg-teal-700"
            }
            onClick={() => navigate("/update")}
          >
            Update
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileHead;
