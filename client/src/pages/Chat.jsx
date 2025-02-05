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
import { setConversations } from "../../slices/conversations";
import { ImSpinner8 } from "react-icons/im";
import { setSelectedConversations } from "../../slices/conversations";
const Chat = () => {
  const currentTheme = useSelector((state) => state.themeToggler.theme);
  const currentUser = useSelector((state) => state.user.userInfo);
  const conversation = useSelector((state) => state.conversation.conversations);
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversations
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
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

  //Retrieve The Conversations:
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5555/api/v1/messages/conversations",
          { withCredentials: true }
        );
        dispatch(setConversations(response?.data?.conversation));
        setLoadingConversation(false);
      } catch (error) {
        let message =
          "Unable To Get Conversations!" || error?.response?.data?.message;
        enqueueSnackbar(message, { variant: "error" });
        setLoadingConversation(false);
      }
    };
    fetchConversation();
  }, [dispatch, enqueueSnackbar, conversation]);

  //Handle Search
  const handleSearch = async () => {
    if (!search) return;
    setSearchLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5555/api/v1/users/profile/${search}`
      );
      const searchedUser = response.data.userExists;
      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        setSearchLoading(false);
        return enqueueSnackbar("You Can't Message Yourself!", {
          variant: "info",
        });
      }
      const conversationAlreadyExists = conversation.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (conversationAlreadyExists) {
        dispatch(
          setSelectedConversations({
            _id: conversationAlreadyExists._id,
            userId: searchedUser._id,
            username: searchedUser.username,
            userProfilePic: searchedUser.profilePic,
          })
        );
        enqueueSnackbar("Messages Found!", { variant: "success" });
        return setSearchLoading(false);
      }
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: {},
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvos) => [...prevConvos, mockConversation]);
      setSearchLoading(false);
    } catch (error) {
      let message =
        "Unable To Search For User!" || error.response?.data?.message;
      enqueueSnackbar(message, { variant: "error" });
      setSearchLoading(false);
    }
  };

  //Render:
  return (
    <div
      className={`w-full min-h-screen flex flex-col justify-start items-center ${
        currentTheme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <Navbar />
      <div className="mt-[2rem] mb-[2rem] w-[95%] lg:w-[85%] bg-transparent flex flex-col justify-start items-center lg:flex-row lg:justify-around lg:items-start">
        {/* Container-1 */}
        <div className="mt-2 mb-2 w-[95%] lg:w-[25%] bg-transparent rounded-md flex flex-col justify-start items-center">
          <div className="text-[1.25rem] font-semibold mb-2 mt-2">
            Your Conversations
          </div>
          <div className="w-[95%] h-[10vh] flex justify-center items-center bg-transparent mb-2">
            <input
              className="w-[75%] h-[7vh] rounded-md p-2 text-[1.05rem] font-semibold placeholder-slate-400 border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 mr-2 bg-transparent"
              placeholder="Search For User"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <button
              className="w-[20%] h-[8vh] rounded-md shadow-md bg-gradient-to-br to-rose-400 from-sky-400 text-white flex justify-center items-center transition-all ease-in-out duration-500 hover:scale-105"
              onClick={() => handleSearch()}
            >
              {searchLoading === true ? (
                <ImSpinner8 className="text-[2rem] animate-spin" />
              ) : (
                <MdOutlinePersonSearch className="text-[2rem]" />
              )}
            </button>
          </div>
          {/* Skeleton For Loading Or Searching! */}
          {loadingConversation &&
            [0, 1, 2, 3, 4].map((item) => (
              <div
                className="w-[95%] h-[12vh] flex justify-around items-center bg-transparent animate-pulse mb-2 hover:cursor-pointer transition-all ease-in-out hover:scale-105"
                key={item}
              >
                <div className="w-[17%] h-[8vh] lg:w-[18%] lg:h-[7.5vh] rounded-[50%] bg-slate-400 shadow-md animate-pulse"></div>
                <div className="w-[75%] h-[11vh] flex flex-col justify-start items-start p-2 bg-transparent animate-pulse">
                  <div className="text-[1.05rem] font-semibold animate-pulse">
                    {" "}
                    Username{" "}
                  </div>
                  <div className="text-[0.95rem] animate-pulse">
                    Latest Message
                  </div>
                </div>
              </div>
            ))}
          {!loadingConversation &&
            conversation.map((item) => (
              <Conversation key={item._id} convo={item} />
            ))}
        </div>
        {/* Container-2 */}
        {/* Not Selected Any Conversation! */}
        {!selectedConversation._id && (
          <div className="w-[95%] h-[60vh] lg:w-[70%] lg:h-[60vh] bg-transparent flex flex-col justify-center items-center">
            <div className="mb-2 mt-2 flex justify-center items-center">
              <GiConversation className="text-[10rem] animate-pulse" />
            </div>
            <div className="mt-2 mb-2 text-[1.25rem] lg:text-[1.45rem] text-center">
              Select a conversation to start messaging
            </div>
          </div>
        )}
        {/* Conversation Is Selected! */}
        {selectedConversation._id && <MessageContainer />}
      </div>
    </div>
  );
};

export default Chat;
