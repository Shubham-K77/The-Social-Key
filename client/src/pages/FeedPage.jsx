/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { clearUserInfo } from "../../slices/userInfo";
import { LuLogOut } from "react-icons/lu";
import { setUserInfo } from "../../slices/userInfo";
import { IoMdAdd } from "react-icons/io";
import { FaImage } from "react-icons/fa6";
import { RiImageCircleAiLine } from "react-icons/ri";
import Navbar from "../components/Navbar";
import axios from "axios";
import { GiCancel } from "react-icons/gi";
import { FaSpinner } from "react-icons/fa6";
import { TbWorldUpload } from "react-icons/tb";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { RiAiGenerate2 } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import UserPost from "../components/UserPost";
import SuggestedUsers from "../components/SuggestedUsers";
const FeedPage = () => {
  const theme = useSelector((state) => state.themeToggler.theme);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [createPost, setCreatePost] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImg, setPostImg] = useState("");
  const [postType, setPostType] = useState("Human");
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [feedPost, setFeedPost] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [AIButtonClick, setAIButtonClick] = useState(false);
  const [AIText, setAIText] = useState("");
  const fileRef = useRef();

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
  }, [userInfo, navigate, enqueueSnackbar, dispatch]);

  useEffect(() => {
    const retrievePost = async () => {
      try {
        setFeedLoading(true);
        const response = await axios.get(
          "https://the-social-key-api.vercel.app/api/v1/posts/feed",
          { withCredentials: true }
        );
        setFeedPost(response.data.feedPost);
        enqueueSnackbar(response.data.message, { variant: "success" });
        setFeedLoading(false);
      } catch (error) {
        const errorMessage = error.response.data.message || "Unexpected Error!";
        enqueueSnackbar(errorMessage, { variant: "error" });
        setFeedLoading(false);
      }
    };
    retrievePost();
  }, [enqueueSnackbar, userInfo]);

  const handleUserPic = (picture) => {
    if (picture) {
      const fileRead = new FileReader();
      fileRead.onload = (e) => {
        const imgUrl = e.target.result;
        setPostImg(imgUrl);
      };
      fileRead.readAsDataURL(picture);
      setPostType("Human");
    }
  };

  const handleAiPicture = async () => {
    try {
      if (AIText.length > 20) {
        setLoading(true);
        const response = await axios.post(
          "https://the-social-key-api.vercel.app/api/v1/posts/tti",
          { prompt: AIText },
          { withCredentials: true }
        );
        //Convert The arrayBuffer Into UInt8 Array:
        const imageResponseArray = await response.data.data.data;
        const encodedArray = new Uint8Array(imageResponseArray);
        //Convert Into Blob:
        const blob = new Blob([encodedArray], { type: "image/jpg" });
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const base64Url = e.target.result;
          setPostImg(base64Url);
        };
        fileReader.readAsDataURL(blob);
        enqueueSnackbar("Image Generated!", { variant: "success" });
        enqueueSnackbar(`Remaining Credit: ${userInfo.credit}`, {
          variant: "success",
        });
        setLoading(false);
        setPostType("AI");
      } else {
        enqueueSnackbar("Prompt Must Be Longer Than 20 Characters!", {
          variant: "error",
        });
        setLoading(false);
        setPostType("Human");
        setAIText("");
        setAIButtonClick(false);
        return setPostImg("");
      }
    } catch (error) {
      const errorMessage =
        error.response.data.message || "Image Generation Failed!";
      enqueueSnackbar(errorMessage, { variant: "error" });
      setPostImg("");
      setPostType("Human");
      setLoading(false);
      setAIText("");
      setAIButtonClick(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://the-social-key-api.vercel.app/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      enqueueSnackbar(response.data.message, { variant: "success" });
      dispatch(clearUserInfo());
      navigate("/");
    } catch (error) {
      const errorMessage = "User is not authenticated.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      navigate("/");
    }
  };

  const handleCreatePost = async () => {
    try {
      setPostLoading(true);
      const response = await axios.post(
        "https://the-social-key-api.vercel.app/api/v1/posts/create",
        { postedBy: userInfo._id, text: postText, img: postImg, postType },
        { withCredentials: true }
      );
      enqueueSnackbar(response.data.message, { variant: "success" });
      setPostText("");
      setPostImg("");
      setCreatePost(false);
      setPostLoading(false);
    } catch (error) {
      const errorMessage =
        error.response.data.message || "Unable To Create Post!";
      enqueueSnackbar(errorMessage, { variant: "error" });
      setPostLoading(false);
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
      {/* Buttons */}
      <div className="w-[98%] lg:w-[95%] h-[15vh] bg-transparent mb-[2rem] mt-2 flex justify-evenly lg:justify-center items-center">
        <div
          className={`lg:ml-[3rem] w-[25%] h-[8vh] lg:w-[8%] lg:h-[8vh] rounded-md shadow-md text-[1.05rem] font-bold flex justify-center items-center mr-4 ml-3 ${
            theme === "light"
              ? "bg-rose-400 text-black hover:bg-rose-500"
              : "bg-sky-500 text-white hover:bg-sky-600"
          } hover:cursor-pointer`}
          onClick={() => (userInfo ? navigate("/chat") : navigate("/login"))}
        >
          <IoChatboxEllipsesOutline className="text-[2rem]" />
        </div>
        <div
          className={`w-[25%] h-[8vh] lg:w-[8%] lg:h-[8vh] rounded-md shadow-md text-[1.05rem] font-bold flex justify-center items-center mr-4 ${
            theme === "light"
              ? "bg-rose-400 text-black hover:bg-rose-500"
              : "bg-sky-500 text-white hover:bg-sky-600"
          } hover:cursor-pointer`}
          onClick={() => navigate(`/${userInfo.username}`)}
        >
          <RxAvatar className="text-[2rem]" />
        </div>
        <div
          className={`w-[25%] h-[8vh] lg:w-[8%] lg:h-[8vh] rounded-md shadow-md text-[1.05rem] font-bold flex justify-center items-center mr-4 ${
            theme === "light"
              ? "bg-rose-400 text-black hover:bg-rose-500"
              : "bg-sky-500 text-white hover:bg-sky-600"
          } hover:cursor-pointer`}
          onClick={() => navigate("/dashboard")}
        >
          <MdDashboard className="text-[2rem]" />
        </div>
        <div
          className={`w-[25%] h-[8vh] lg:w-[8%] lg:h-[8vh] rounded-md shadow-md text-[1.05rem] font-bold flex justify-center items-center mr-4 ${
            theme === "light"
              ? "bg-rose-400 text-black hover:bg-rose-500"
              : "bg-sky-500 text-white hover:bg-sky-600"
          } hover:cursor-pointer`}
          onClick={() => handleLogout()}
        >
          <LuLogOut className="text-[2rem]" />
        </div>
      </div>
      {/* Suggested Users */}
      <div className="w-[90%] lg:w-[30%] bg-transparent mb-2">
        <SuggestedUsers />
      </div>
      {/* Create The Post */}
      {createPost === true ? (
        <div
          className={`w-[95%] bg-transparent flex justify-center items-center ${
            postImg
              ? "h-[180vh]"
              : AIButtonClick === true
              ? "h-[100vh]"
              : "h-[95vh]"
          }`}
        >
          <div
            className={`w-[95%] lg:w-[55%] bg-transparent flex flex-col justify-start items-center ${
              postImg ? "h-[175vh]" : "h-[95vh] mb-[-2rem]"
            }`}
          >
            <div className="w-[90%] mb-2 text-[2rem] font-bold flex justify-center items-center mt-2">
              Create Post
            </div>
            <div className="w-[90%] mb-[0.25rem] mt-[1rem]">
              <textarea
                maxLength={500}
                rows={6}
                placeholder="Please enter a caption that best describes your content. 🥴"
                value={postText}
                className="w-full rounded-md text-[1.05rem] bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 p-2 text-justify"
                onChange={(e) => setPostText(e.target.value)}
              />
            </div>
            <div className="w-[90%] flex justify-end items-center mb-2">
              <div className="text-[1rem] font-bold">{postText.length}/500</div>
            </div>
            <div className="w-[90%] h-[10vh] flex justify-start items-center bg-transparent">
              <div
                className="w-[35%] lg:w-[15%] h-[8vh] rounded-md shadow-md bg-teal-500 ml-2 mr-2 flex justify-center items-center hover:bg-teal-600 hover:cursor-pointer"
                onClick={() => fileRef.current.click()}
              >
                <FaImage className="text-[2rem] font-bold text-white" />
              </div>
              <div
                className={`w-[35%] lg:w-[15%] h-[8vh] rounded-md shadow-md bg-purple-500 ml-2 mr-2 flex justify-center items-center hover:bg-purple-600 hover:cursor-pointer`}
                onClick={() => setAIButtonClick(!AIButtonClick)}
              >
                <RiImageCircleAiLine className="text-[2rem] font-bold text-white" />
              </div>
              <div
                className="w-[35%] lg:w-[15%] h-[8vh] rounded-md shadow-md bg-red-500 ml-2 mr-2 flex justify-center items-center hover:bg-red-600 hover:cursor-pointer"
                onClick={() => {
                  setPostImg("");
                }}
              >
                <GiCancel className="text-[2rem] font-bold text-white" />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileRef}
                  onChange={(e) => handleUserPic(e.target.files[0])}
                />
              </div>
            </div>
            {AIButtonClick === true ? (
              <div className="w-[98%] lg:w-[95%] h-[20vh] mt-[2rem] bg-transparent flex justify-around items-center">
                <input
                  type="text"
                  className="bg-transparent border-2 border-slate-400 rounded-md w-[70%] lg:w-[65%] h-[10vh] focus:outline-none focus:ring-2 focus:ring-green-500 p-2 text-[0.95rem]"
                  placeholder="Unleash your creativity: Enter your AI prompt ✨🤖"
                  onChange={(e) => setAIText(e.target.value)}
                />
                <div
                  className={`w-[25%] lg:w-[15%] h-[10vh] flex justify-center items-center bg-gradient-to-r from-rose-400 to-blue-500 rounded-md shadow-md hover:cursor-pointer hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 ${
                    loading === true ? "animate-pulse" : ""
                  }`}
                  onClick={() => handleAiPicture()}
                >
                  <RiAiGenerate2 className="text-[2.25rem] text-white" />
                </div>
              </div>
            ) : (
              <></>
            )}
            {postImg ? (
              loading === true ? (
                <div className="w-[60%] h-[70vh] flex justify-center items-center">
                  <FaSpinner className="text-[5rem] font-bold animate-spin" />
                </div>
              ) : (
                <>
                  <div
                    className="w-[95%] lg:w-[60%] h-[70vh] bg-purple-400 mt-[2rem] mb-2 rounded-md"
                    style={{
                      backgroundImage: `url(${postImg})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>
                </>
              )
            ) : null}
            <div
              className={`w-[50%] lg:w-[25%] flex justify-center items-center h-[10vh] lg:h-[10vh] rounded-md shadow-md hover:cursor-pointer mt-[2rem] mb-[2rem] ${
                theme === "light"
                  ? "bg-rose-400 hover:bg-rose-500"
                  : "bg-sky-500 hover:bg-sky-600"
              } ${postLoading === true ? "animate-pulse" : ""} `}
              onClick={() => handleCreatePost()}
            >
              <TbWorldUpload className="text-[2.25rem] font-bold mr-2" />
              <div className="text-[1.25rem] font-bold">Post</div>
            </div>
          </div>
        </div>
      ) : null}
      {/* Get The Feed */}
      {feedLoading === true ? (
        <div className="w-full h-[20vh] mt-[2rem] flex justify-center items-center">
          {" "}
          <FaSpinner className="text-[3rem] font-bold animate-spin" />{" "}
        </div>
      ) : !feedLoading && feedPost.length === 0 ? (
        <div className="w-full lg:w-[95%] h-[20vh] flex justify-center items-center p-2">
          <div className="text-[1.05rem] lg:text-[1.25rem] font-bold ml-[1.25rem] lg:ml-0">
            Your feed is empty! Follow some users to start seeing posts.
          </div>
        </div>
      ) : (
        <div className="w-[90%] lg:w-[45%] min-h-screen bg-transparent pr-4 lg:p-0">
          {feedPost.map((item) => (
            <UserPost key={item._id} post={item} setFeedPost={setFeedPost} />
          ))}
        </div>
      )}
      {/* Add Post Button */}
      <div className="w-[45%] lg:w-[20%] h-[15vh] fixed bottom-5 right-5 flex justify-center items-center bg-transparent p-2">
        <div
          className={`w-[55%] lg:w-[35%] h-[9.5vh] lg:h-[8vh] flex justify-center items-center text-[1.25rem] font-bold rounded-md shadow-md ${
            theme === "light"
              ? "bg-rose-400 text-black hover:bg-rose-500"
              : "bg-sky-500 text-white hover:bg-sky-600"
          } hover:cursor-pointer`}
          onClick={() => setCreatePost(!createPost)}
        >
          <div className="text-[2.25rem] font-bold">
            <IoMdAdd />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
