/* eslint-disable react/prop-types */
/* eslint-disable no-constant-binary-expression */
import { LuSendHorizontal } from "react-icons/lu";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useSelector } from "react-redux";
const MessageInput = ({ setMessages }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState("");
  const conversation = useSelector(
    (state) => state.conversation.selectedConversations
  );
  const handleSubmit = async () => {
    if (!message) return;
    try {
      const response = await axios.post(
        "https://the-social-key-api.vercel.app/api/v1/messages/",
        {
          recepientId: conversation.userId,
          message,
        },
        { withCredentials: true }
      );
      setMessages((messages) => [...messages, response.data.newMessage]);
      setMessage("");
      enqueueSnackbar("Message Sent Successfully!", { variant: "success" });
    } catch (error) {
      let message =
        "Failed Retrieving Messages!" || error?.response?.data?.message;
      enqueueSnackbar(message, { variant: "error" });
    }
  };
  return (
    <div className="w-[95%] h-[15vh] mt-2 bg-transparent flex justify-around items-center">
      <textarea
        rows={3}
        cols={10}
        className="w-[75%] h-[12vh] focus:outline-none focus:ring-2 focus:ring-green-400 mr-2 focus:border-green-400 text-[0.95rem] placeholder-gray-400 p-2 bg-transparent rounded-md border-2 border-gray-500"
        placeholder={"Send Message!"}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <div
        className="w-[28%] lg:w-[14%] h-[8.5vh] bg-indigo-500 shadow-md rounded-md flex justify-center items-center transition-transform ease-in-out duration-200 hover:cursor-pointer hover:scale-105 hover:bg-indigo-600"
        onClick={() => handleSubmit()}
      >
        <LuSendHorizontal className="text-[2rem] text-white" />
      </div>
    </div>
  );
};

export default MessageInput;
