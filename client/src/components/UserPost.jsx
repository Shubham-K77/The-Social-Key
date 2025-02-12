/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import PostHead from "./PostHead";
import Icons from "./Icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { IoSend } from "react-icons/io5";
import { enqueueSnackbar } from "notistack";

const UserPost = ({ post: initialPost, setFeedPost }) => {
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(initialPost);
  const [comment, setComment] = useState(false);
  const currentUser = useSelector((state) => state.user.userInfo);
  const [userComment, setUserComment] = useState("");
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://the-social-key-api.vercel.app/api/v1/posts/${currentPost._id}`
        );
        setCurrentPost(response.data.postInfo);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };
    if (currentPost?._id) {
      fetchPost();
    }
  }, [currentPost?._id]);

  useEffect(() => {}, [currentPost]);

  const handlePostUpdate = (updatedPost, type = "like") => {
    if (type === "like") {
      return setCurrentPost(updatedPost);
    }
    if (type === "comment") {
      setComment(!comment);
    }
    if (type === "delete") {
      setFeedPost((prevPosts) =>
        prevPosts.filter((post) => post._id !== updatedPost)
      );
    }
  };

  const handleReplies = async () => {
    try {
      const response = await axios.put(
        `https://the-social-key-api.vercel.app/api/v1/posts/reply/${currentPost._id}`,
        { text: userComment },
        { withCredentials: true }
      );
      enqueueSnackbar(response.data.message, { variant: "success" });
      setComment(false);
      const newPostResponse = await axios.get(
        `https://the-social-key-api.vercel.app/api/v1/posts/${currentPost._id}`
      );
      setCurrentPost(newPostResponse.data.postInfo);
      setComment(!comment);
      setUserComment("");
    } catch (error) {
      const message = error.response.data.message || "Unable To Reply!";
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <div
      className={`w-[100%] flex flex-col justify-start items-start p-2 overflow-x-hidden ${
        currentPost.img && currentPost.img.trim().length > 0
          ? "min-h-screen"
          : "h-[50vh]"
      }`}
    >
      <PostHead
        username={currentPost.postedBy.username}
        pid={currentPost._id}
        pp={currentPost.postedBy.profilePic}
        days={currentPost.createdAt}
      />
      <div className="w-full flex justify-center items-center bg-transparent mb-[1rem] p-2">
        <div className="text-[1.15rem] text-justify">{currentPost.text}</div>
      </div>
      {currentPost.img && currentPost.img.trim().length > 0 ? (
        <div className="w-full lg:h-[120vh] lg:flex lg:flex-col lg:justify-center lg:items-center lg:rounded-md mb-[2rem] lg:shadow-md lg:bg-slate-100 lg:text-gray-900">
          <div
            className="w-full h-[65vh] lg:w-[85%] lg:h-[80vh] shadow-md rounded-md mb-[1rem] lg:mb-4 hover:cursor-pointer"
            onClick={() =>
              navigate(
                `/${currentPost.postedBy.username}/post/${currentPost._id}`
              )
            }
            style={{
              backgroundImage: `url('${currentPost.img}')`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          <Icons post={currentPost} onPostUpdate={handlePostUpdate} />
          <div className="w-full lg:w-[85%] h-[5vh] flex justify-around items-center bg-transparent">
            <div className="text-[1.25rem] lg:text-[1.5rem] mr-2">
              {currentPost.replies.length > 0
                ? `${currentPost.replies.length} replies`
                : "😪 0 replies"}
            </div>
            <div className="text-[1.25rem] lg:text-[1.5rem] mr-2">
              {currentPost.likes.length > 0
                ? `${currentPost.likes.length} likes`
                : "😴 0 likes"}
            </div>
            <div className="w-[24%] lg:w-[16%] h-[6.5vh] bg-amber-800 text-white font-bold text-[1rem] lg:text-[1.25rem] rounded-md shadow-md flex justify-center items-center">
              {currentPost.postType}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <Icons post={currentPost} onPostUpdate={handlePostUpdate} />
        </div>
      )}
      {comment === true && Object.keys(currentUser).length > 0 ? (
        <div className="w-full h-[45vh] lg:h-[20vh] bg-transparent mb-[2rem] flex flex-col justify-start items-center lg:flex-row lg:justify-around lg:items-center">
          <div className="w-[45%] lg:w-[25%] h-[15vh] flex flex-col justify-start items-center bg-transparent mb-2 lg:mb-0">
            <div
              className="w-[45%] lg:w-[42%] h-[10vh] shadow-md rounded-[50%]"
              style={{
                backgroundImage: `url(${
                  currentUser.profilePic || "/Images/avatar.png"
                })`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
            <div className="mt-2 text-[1.25rem] font-semibold">
              {currentUser.username}
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
    </div>
  );
};

export default UserPost;
