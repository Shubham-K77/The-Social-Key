/* eslint-disable react/prop-types */
import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

const Icons = ({ post, onPostUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [comment, setComment] = useState(false);
  const [qr, setQr] = useState(false);
  const [url, setUrl] = useState("");
  const userInfo = useSelector((state) => state.user.userInfo);
  const [like, setLike] = useState(post.likes.includes(userInfo?._id));

  const qrLoad = async () => {
    try {
      const currentUrl = `http://localhost:5173/${post.postedBy.username}/post/${post._id}`;
      const response = await axios.post(
        "http://localhost:5555/api/v1/users/qrCode",
        {
          currentUrl,
          type: "post",
          pid: post._id,
          username: post.postedBy.username,
        }
      );
      setUrl(response.data.url);
      if (qr == false) {
        setQr(true);
        enqueueSnackbar("QR Generated!", { variant: "success" });
      } else {
        setQr(false);
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const likeTest = async () => {
    if (!userInfo)
      return enqueueSnackbar("Login To Like A Post!", { variant: "error" });
    try {
      const response = await axios.put(
        `http://localhost:5555/api/v1/posts/like/${post._id}`,
        {},
        { withCredentials: true }
      );

      // Create updated post object
      const updatedPost = !like
        ? { ...post, likes: [...post.likes, userInfo._id] }
        : { ...post, likes: post.likes.filter((id) => id !== userInfo._id) };
      // Update parent component
      onPostUpdate(updatedPost);
      // Update local state
      setLike(!like);
      enqueueSnackbar(response.data.message, { variant: "success" });
    } catch (error) {
      const errorMessage = error.response.data.message || "Unable To Like!";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const commentTest = () => {
    // Update local state
    setComment(!comment);
    onPostUpdate(null, "comment");
  };

  const deleteTest = async () => {
    try {
      if (!window.confirm("Are you sure want to delete this post? ")) return;
      const response = await axios.delete(
        `http://localhost:5555/api/v1/posts/${post._id}`,
        { withCredentials: true }
      );
      enqueueSnackbar(response.data.message, { variant: "success" });
      onPostUpdate(post._id, "delete");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unexpected Error!";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };
  return (
    <div className="w-full lg:w-[85%] h-[10vh] flex justify-center items-center bg-transparent mb-[1rem] lg:mb-2">
      <div className="mr-2 hover:cursor-pointer" onClick={likeTest}>
        {like ? (
          <FaHeart className="text-[2rem] text-red-600" />
        ) : (
          <CiHeart className="text-[2rem]" />
        )}
      </div>
      <div className="mr-2 hover:cursor-pointer" onClick={commentTest}>
        {comment ? (
          <FaComment className="text-[1.75rem] text-blue-600" />
        ) : (
          <FaRegComment className="text-[1.75rem]" />
        )}
      </div>
      {Object.keys(userInfo).length > 0 &&
      post?.postedBy._id === userInfo?._id ? (
        <div
          className="mr-2 hover:cursor-pointer hover:animate-pulse"
          onClick={() => deleteTest()}
        >
          <MdDelete className="text-[1.75rem]" />
        </div>
      ) : null}
      <div className="mr-2" onClick={qrLoad}>
        {qr ? (
          <div
            className="w-[18vw] lg:w-[5vw] h-[10vh] bg-slate-100"
            style={{
              backgroundImage: `url(${url})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
        ) : (
          <IoQrCode className="text-[1.75rem] hover:text-green-800 hover:cursor-pointer" />
        )}
      </div>
    </div>
  );
};

export default Icons;
