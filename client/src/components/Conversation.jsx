/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from "react-redux";
import { setSelectedConversations } from "../../slices/conversations";
const Conversation = ({ convo, isOnline }) => {
  const currentTheme = useSelector((state) => state.themeToggler.theme);
  const currentUser = useSelector((state) => state.user.userInfo);
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversations
  );
  const dispatch = useDispatch();
  const user = convo.participants[0];
  const message = convo.lastMessage;
  return (
    <div
      className={`w-[95%] h-[12vh] flex justify-around items-center bg-transparent mb-2 mt-2 hover:cursor-pointer transition-all ease-in-out hover:scale-105 ${
        currentTheme === "light" ? "hover:bg-slate-200" : "hover:bg-gray-600"
      } ${
        selectedConversation._id === convo._id
          ? currentTheme === "light"
            ? "bg-slate-200 rounded-md"
            : "bg-gray-600 rounded-md"
          : ""
      }`}
      onClick={() =>
        dispatch(
          setSelectedConversations({
            _id: convo._id,
            userId: user._id,
            username: user.username,
            userProfilePic: user.profilePic,
            mock: convo.mock,
          })
        )
      }
    >
      <div
        className="w-[17%] h-[8vh] lg:w-[18%] lg:h-[7.5vh] rounded-[50%] shadow-md"
        style={{
          backgroundImage: `url(${user.profilePic || "/Images/avatar.png"})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="w-[75%] h-[11vh] flex flex-col justify-start items-start p-2 bg-transparent">
        <div className="text-[1.05rem] font-semibold">
          {user.username}{" "}
          <span className="ml-2 text-green-400 text-[0.85rem] font-bold">
            {" "}
            {isOnline && "online"}{" "}
          </span>
        </div>
        <div className="text-[0.95rem]">
          {currentUser._id === message.sender ? "✔️ " : ""}
          {message.text.length > 18
            ? message.text.substring(0, 18) + "..."
            : message.text}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
