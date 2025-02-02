import { useParams } from "react-router-dom";
import PostHead from "../components/PostHead";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { RiVoiceAiLine } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import Icons from "../components/Icons";
import Comment from "../components/Comment";
import { useNavigate } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { setUserInfo } from "../../slices/userInfo";

const PostPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [aiVoice, setAiVoice] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [voiceLoading, setVoiceLoading] = useState(false);
  const theme = useSelector((state) => state.themeToggler.theme);
  const userInfo = useSelector((state) => state.user.userInfo);
  const { pid } = useParams();
  const [currentPost, setCurrentPost] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userComment, setUserComment] = useState("");
  const [comment, setComment] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const retrievePost = async () => {
      if (!pid) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5555/api/v1/posts/${pid}`,
          { withCredentials: true }
        );
        if (response.data && response.data.postInfo) {
          setCurrentPost(response.data.postInfo);
          enqueueSnackbar("Post Data Fetched!", { variant: "success" });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error fetching post";
        enqueueSnackbar(errorMessage, { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    retrievePost();
  }, [enqueueSnackbar, pid]);

  useEffect(() => {
    const retrieveUser = async () => {
      if (!userInfo || Object.keys(userInfo).length === 0) {
        const response = await axios.get(
          "http://localhost:5555/api/v1/users/token",
          { withCredentials: true }
        );
        if (response.data.userInfo) {
          dispatch(setUserInfo(response.data.userInfo));
        }
      }
    };
    retrieveUser();
  }, [userInfo, dispatch]);

  const aiButton = async () => {
    setAiVoice(!aiVoice);
    if (aiVoice === true && currentPost?.text) {
      try {
        setVoiceLoading(true);
        const response = await axios.post(
          "http://localhost:5555/api/v1/posts/tts",
          { prompt: currentPost.text }
        );
        const audioResponseArray = await response.data.data.data;
        const encodedArray = new Uint8Array(audioResponseArray);
        const blob = new Blob([encodedArray], { type: "audio/mpeg" });
        const localUrl = URL.createObjectURL(blob);
        setVoiceUrl(localUrl);
        enqueueSnackbar(response.data.message, { variant: "success" });
        enqueueSnackbar(`Remaining Credit: ${userInfo.credit}`, {
          variant: "success",
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error generating voice";
        enqueueSnackbar(errorMessage, { variant: "error" });
      } finally {
        setVoiceLoading(false);
      }
    }
  };

  const handlePostUpdate = (updatedPost, type = "like") => {
    if (type === "like") {
      return setCurrentPost(updatedPost);
    }
    if (type === "delete") {
      navigate(`/main`);
    }
    if (type === "comment") {
      setComment(!comment);
    }
  };

  const handleReplies = async () => {
    console.log(comment);
    try {
      const response = await axios.put(
        `http://localhost:5555/api/v1/posts/reply/${currentPost._id}`,
        { text: userComment },
        { withCredentials: true }
      );
      enqueueSnackbar(response.data.message, { variant: "success" });
      setComment(false);
      const newPostResponse = await axios.get(
        `http://localhost:5555/api/v1/posts/${pid}`
      );
      setCurrentPost(newPostResponse.data.postInfo);
      setComment(!comment);
      setUserComment("");
    } catch (error) {
      const message = error.response.data.message || "Unable To Reply!";
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  if (loading) {
    return (
      <div
        className={`w-[100%] min-h-screen flex flex-col justify-center items-center p-2 overflow-x-hidden ${
          theme === "light"
            ? "bg-gray-100 text-gray-900"
            : "bg-gray-900 text-gray-100"
        }`}
      >
        <FaSpinner className="text-[3rem] font-bold animate-spin" />
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div
        className={`w-[100%] min-h-screen flex flex-col justify-center items-center p-2 overflow-x-hidden ${
          theme === "light"
            ? "bg-gray-100 text-gray-900"
            : "bg-gray-900 text-gray-100"
        }`}
      >
        <div>Post not found</div>
      </div>
    );
  }

  return (
    <div
      className={`w-[100%] min-h-screen flex flex-col justify-start items-center p-2 overflow-x-hidden ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <Navbar />
      <div className="mt-2 lg:mt-[2rem] w-[90%] lg:w-[45%] bg-transparent flex flex-col justify-start items-center">
        {currentPost.postedBy && (
          <PostHead
            username={currentPost.postedBy.username}
            pid={currentPost._id}
            pp={currentPost.postedBy.profilePic || "/Images/avatar.png"}
            days={currentPost.createdAt}
          />
        )}
        {currentPost.text && (
          <div className="w-full text-[1rem] text-justify mt-[1rem] mb-[0.5rem] p-2">
            {currentPost.text}
          </div>
        )}
        <div className="w-full h-[12vh] bg-transparent flex justify-around items-center mb-2">
          <div
            className="w-[15%] lg:w-[10%] h-[8vh] bg-transparent flex justify-center items-center hover:cursor-pointer hover:text-red-400"
            onClick={aiButton}
          >
            <RiVoiceAiLine className="text-[2.5rem]" />
          </div>
          {aiVoice && (
            <div className="w-[80%] h-[8vh] bg-transparent flex justify-center items-center">
              {voiceLoading ? (
                <FaSpinner className="text-[2rem] animate-spin" />
              ) : (
                <audio controls className="h-[6vh] w-full bg-transparent">
                  <source src={voiceUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}
        </div>
        <div className="w-full lg:h-[120vh] lg:flex lg:flex-col lg:justify-center lg:items-center lg:rounded-md mb-[2rem] lg:shadow-md lg:bg-slate-100 lg:text-gray-900">
          {currentPost.img && (
            <div
              className="w-[100%] h-[65vh] lg:w-[85%] lg:h-[80vh] shadow-md rounded-md mb-[1rem] lg:mb-4 hover:cursor-pointer"
              style={{
                backgroundImage: `url('${currentPost.img}')`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
          )}
          <Icons post={currentPost} onPostUpdate={handlePostUpdate} />
          <div className="w-full lg:w-[85%] h-[5vh] flex justify-around items-center bg-transparent">
            <div className="text-[1.25rem] font-semibold mr-2">
              {currentPost.replies?.length || 0} Replies
            </div>
            <div className="text-[1.25rem] font-semibold mr-2">
              {currentPost.likes?.length || 0} Likes
            </div>
            {currentPost.postType && (
              <div className="w-[24%] lg:w-[18%] h-[6.5vh] font-bold text-[1rem] lg:text-[1.25rem] bg-amber-700 text-white flex justify-center items-center rounded-md shadow-md">
                {currentPost.postType}
              </div>
            )}
          </div>
        </div>

        {/* The Signup/Register CTA */}
        {Object.keys(userInfo).length > 0 ? null : (
          <div className="w-[95%] lg:w-[80%] h-[12vh] mt-2 lg:p-2 bg-transparent mb-2 flex justify-around items-center">
            <div className="font-roboto text-[0.85rem] lg:text-[0.95rem]">
              👋Get the app to like, reply and post
            </div>
            <div
              className="rounded-md w-[25%] lg:w-[18%] h-[7vh] bg-blue-500 font-roboto text-[0.95rem] shadow-md flex justify-center items-center hover:cursor-pointer hover:bg-blue-600 text-white"
              onClick={() => navigate("/signup")}
            >
              Register
            </div>
          </div>
        )}

        {comment === true && Object.keys(userInfo).length > 0 ? (
          <div className="w-full h-[45vh] lg:h-[20vh] bg-transparent mb-[2rem] flex flex-col justify-start items-center lg:flex-row lg:justify-around lg:items-center">
            <div className="w-[45%] lg:w-[25%] h-[15vh] flex flex-col justify-start items-center bg-transparent mb-2 lg:mb-0">
              <div
                className="w-[45%] lg:w-[42%] h-[10vh] shadow-md rounded-[50%]"
                style={{
                  backgroundImage: `url(${
                    userInfo.profilePic || "/Images/avatar.png"
                  })`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              ></div>
              <div className="mt-2 text-[1.05rem] font-semibold">
                {userInfo.username}
              </div>
            </div>
            <div className="w-[100%] h-[28vh] lg:w-[70%] lg:h-[15vh] bg-transparent flex justify-around items-center">
              <div className="w-[75%] h-[26vh] lg:h-[13vh] bg-transparent flex flex-col justify-evenly items-center">
                <textarea
                  rows={2}
                  maxLength={50}
                  className="mb-2 w-[95%] h-[20vh] lg:h-[8vh] bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-md text-[1.05rem] p-2"
                  placeholder="Your Text..."
                  onChange={(e) => setUserComment(e.target.value)}
                />
                <div className="text-[1rem] font-semibold flex justify-end items-center">
                  {userComment.length}/50
                </div>
              </div>
              <div className="w-[25%] h-[26vh] lg:h-[13vh] flex justify-center items-center bg-transparent">
                <div
                  className="w-[85%] h-[10vh] lg:h-[8vh] rounded-md bg-teal-500 flex justify-center items-center hover:cursor-pointer hover:bg-teal-600 text-white"
                  onClick={() => handleReplies()}
                >
                  <IoSend className="text-[1.75rem] lg:text-[1.5rem] font-bold" />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {currentPost.replies?.map((reply) => (
          <Comment key={reply._id} reply={reply} />
        ))}
      </div>
    </div>
  );
};

export default PostPage;
