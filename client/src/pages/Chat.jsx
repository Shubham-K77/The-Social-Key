/* eslint-disable no-constant-binary-expression */
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Navbar from "../components/Navbar";
import { setUserInfo } from "../../slices/userInfo";
import { MdOutlinePersonSearch } from "react-icons/md";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import { MessageContainer } from "../components/MessageContainer";
const Chat = () => {
  const currentTheme = useSelector((state) => state.themeToggler.theme);
  const currentUser = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  //Retrieve User For Every Render!
  useEffect(() => {
    const retrieveUser = async () => {
      if (!currentUser || Object.keys(currentUser).length === 0) {
        try {
          const response = await axios.get(
            "http://localhost:5555/api/v1/users/token",
            { withCredentials: true }
          );
          if (response.data.userInfo) {
            dispatch(setUserInfo(response.data.userInfo));
          } else {
            enqueueSnackbar("User Not Logged In!", { variant: "error" });
            return navigate("/login");
          }
        } catch (error) {
          let message =
            "User is not authenticated." || error?.response?.data?.message;
          enqueueSnackbar(message, { variant: "error" });
          navigate("/login");
        }
      }
    };
    retrieveUser();
  }, [currentUser, dispatch, enqueueSnackbar, navigate]);

  return (
    <div
      className={`w-full min-h-screen flex flex-col justify-start items-center ${
        currentTheme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <Navbar />
      <div className="mt-[2rem] mb-[2rem] w-[95%] lg:w-[85%] bg-amber-500 flex flex-col justify-start items-center lg:flex-row lg:justify-around lg:items-start">
        <div className="mt-2 mb-2 w-[95%] lg:w-[25%] bg-purple-400 rounded-md flex flex-col justify-start items-center">
          <div className="text-[1.25rem] font-semibold mb-2 mt-2">
            Your Conversations
          </div>
          <div className="w-[95%] h-[10vh] flex justify-center items-center bg-transparent mb-2">
            <input
              className="w-[75%] h-[7vh] rounded-md p-2 text-[1.05rem] font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 mr-2 bg-transparent"
              placeholder="Search For User"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <button className="w-[20%] h-[8vh] rounded-md shadow-md bg-gradient-to-br to-rose-400 from-sky-400 text-white flex justify-center items-center transition-all ease-in-out duration-500 hover:scale-105">
              <MdOutlinePersonSearch className="text-[2rem]" />
            </button>
          </div>
          {false &&
            [0, 1, 2, 3, 4].map((item) => (
              <div
                className="w-[95%] h-[12vh] flex justify-around items-center bg-purple-500 animate-pulse mb-2 hover:cursor-pointer transition-all ease-in-out hover:scale-105"
                key={item}
              >
                <div className="w-[17%] h-[8vh] lg:w-[18%] lg:h-[7.5vh] rounded-[50%] bg-yellow-400 shadow-md"></div>
                <div className="w-[75%] h-[11vh] flex flex-col justify-start items-start p-2 bg-green-500">
                  <div className="text-[1.05rem] font-semibold"> Username </div>
                  <div className="text-[0.95rem]">Latest Message</div>
                </div>
              </div>
            ))}
          <Conversation />
          <Conversation />
          <Conversation />
        </div>
        {/* Not Selected Any Conversation! */}
        {/* <div className="w-[95%] h-[140vh] lg:w-[70%] lg:h-[140vh] bg-orange-600 flex flex-col justify-center items-center">
          <div className="mb-2 mt-2 flex justify-center items-center">
            <GiConversation className="text-[9rem]" />
          </div>
          <div className="mt-2 mb-2 text-[1.25rem] text-center">
            Select a conversation to start messaging
          </div>
        </div> */}
        {/* Conversation Is Selected! */}
        <MessageContainer />
      </div>
    </div>
  );
};

export default Chat;
