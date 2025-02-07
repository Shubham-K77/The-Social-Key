import Message from "./Message";
import MessageInput from "./MessageInput";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useSocket } from "../../context/SocketContext";
import { setConversations } from "../../slices/conversations";
/* eslint-disable no-constant-binary-expression */
export const MessageContainer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const conversation = useSelector(
    (state) => state.conversation.selectedConversations
  );
  const currentUser = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);

  //Get The Socket Events For Message And Update!
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (message) => {
      if (conversation._id === message.conversationId) {
        setMessages((prevMessage) => [...prevMessage, message]);
      }
      dispatch(
        setConversations((prev) => {
          const updatedConversation = prev.map((conv) => {
            if (conv._id === message.conversationId) {
              return {
                ...conv,
                lastMessage: {
                  text: message.text,
                  sender: message.sender,
                },
              };
            }
            return conv;
          });
          return updatedConversation;
        })
      );
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversation._id, dispatch, socket]);

  //For Every Changes In Messages:
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get Messages On Every Reloads!
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      setMessages([]);
      try {
        if (conversation.mock) return;
        const response = await axios.get(
          `http://localhost:5555/api/v1/messages/${conversation.userId}`,
          { withCredentials: true }
        );
        setMessages(response.data.messages);
        setLoading(false);
      } catch (error) {
        let message =
          "Failed Retrieving Messages!" || error?.response?.data?.message;
        enqueueSnackbar(message, { variant: "error" });
        setLoading(false);
      }
    };
    getMessages();
  }, [conversation, enqueueSnackbar]);

  return (
    <div className="w-[95%] h-[140vh] lg:w-[70%] bg-transparent flex flex-col justify-start items-center mt-2 mb-2 rounded-lg">
      <div className="text-[1.35rem] font-semibold mb-2 mt-2">
        Your Messages
      </div>
      <div className="w-[95%] h-[135vh] rounded-md mb-4 flex flex-col justify-start items-center bg-transparent">
        <div className="w-full h-[10vh] bg-transparent rounded-tr-md rounded-tl-md flex justify-start items-center p-2 border-b-2 border-slate-300 mb-[2rem]">
          <div
            className="w-[18%] lg:w-[7%] h-[8vh] rounded-[50%] mr-2 shadow-md"
            style={{
              backgroundImage: `url(${
                conversation.userProfilePic || "/Images/avatar.png"
              })`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="text-[1.15rem] font-semibold">
            {conversation.username}
          </div>
        </div>
        <div className="w-[95%] h-[95vh] bg-transparent overflow-y-auto overflow-x-hidden flex flex-col justify-start items-center p-2">
          {/* Initial Loading!   */}
          {loading &&
            [0, 1, 2].map((item) => (
              <div
                key={item}
                className={`w-full bg-transparent flex flex-row items-center mb-2 p-2 ${
                  item % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                {item % 2 === 0 ? (
                  <>
                    <div className="w-[34%] lg:w-[11.5%] h-[12vh] rounded-[50%] bg-sky-700 shadow-md mr-4 animate-pulse"></div>
                    <div className="w-[60%] lg:w-[80%] flex flex-col justify-start items-start p-2 bg-sky-400 text-white rounded-md animate-pulse">
                      <div className="text-[1rem] font-semibold mb-2 animate-pulse">
                        username
                      </div>
                      <div className="text-[0.85rem] animate-pulse">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Ad ducimus, odit iusto temporibus aliquid maiores.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[60%] lg:w-[80%] flex flex-col justify-start items-end p-2 bg-green-300 text-white rounded-md">
                      <div className="text-[1rem] font-semibold mb-2 animate-pulse">
                        username
                      </div>
                      <div className="text-[0.85rem] text-right animate-pulse">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Reprehenderit qui laboriosam laudantium minus, culpa
                        delectus.
                      </div>
                    </div>
                    <div className="w-[38%] lg:w-[12%] h-[12vh] rounded-[50%] bg-sky-700 shadow-md ml-4 animate-pulse"></div>
                  </>
                )}
              </div>
            ))}
          {/* Own Message!   */}
          {!loading &&
            messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              return (
                <Message
                  key={message._id}
                  ref={isLastMessage ? messageEndRef : null}
                  ownMessage={message.senderId === currentUser._id}
                  message={message}
                />
              );
            })}
        </div>
        {/* Message Input: */}
        <MessageInput setMessages={setMessages} />
      </div>
    </div>
  );
};
