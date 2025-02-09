/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
const Message = ({ ownMessage, message }) => {
  const conversation = useSelector(
    (state) => state.conversation.selectedConversations
  );
  const currentUser = useSelector((state) => state.user.userInfo);
  return (
    <div
      className={`w-full bg-transparent flex flex-row items-center mb-2 p-2 transition-all ease-in-out duration-150 hover:cursor-pointer hover:scale-105 ${
        ownMessage ? "justify-start" : "justify-end"
      }`}
    >
      {ownMessage ? (
        <>
          <div className="w-[60%] lg:w-[80%] flex flex-col justify-start items-end text-white bg-green-400 p-2 rounded-md hover:rounded-none">
            <div className="text-[1.05rem] font-semibold mb-2">
              {currentUser.username}
            </div>
            <div className="text-[0.95rem] lg:text-[0.85rem] text-right">
              {message.text}
            </div>
            <div className="text-[0.95rem] w-full flex justify-end items-center font-bold">
              {message.seen ? (
                <>
                  <IoCheckmarkDoneOutline className={"text-yellow-400"} />
                  <div className="ml-2 text-yellow-400"> seen </div>
                </>
              ) : (
                <>
                  <IoCheckmarkDoneOutline className={"text-white"} />
                  <div className="ml-2 text-white"> unseen </div>
                </>
              )}
            </div>
          </div>
          <div
            className="w-[28%] lg:w-[10%] h-[11vh] rounded-[50%] shadow-md ml-4"
            style={{
              backgroundImage: `url(${
                currentUser.profilePic || "/Images/avatar.png"
              })`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
        </>
      ) : (
        <>
          <div
            className="w-[28%] lg:w-[10%] h-[11vh] rounded-[50%] shadow-md mr-4"
            style={{
              backgroundImage: `url(${
                conversation.userProfilePic || "/Images/avatar.png"
              })`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="w-[60%] lg:w-[80%] flex flex-col justify-start items-start bg-sky-400 text-white p-2 rounded-md hover:rounded-none">
            <div className="text-[1.05rem] font-semibold mb-2">
              {conversation.username}
            </div>
            <div className="text-[0.95rem] lg:text-[0.85rem]">
              {message.text}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
