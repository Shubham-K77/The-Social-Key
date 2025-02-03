import { LuSendHorizontal } from "react-icons/lu";
const MessageInput = () => {
  return (
    <div className="w-[95%] h-[15vh] mt-2 bg-transparent flex justify-around items-center">
      <textarea
        rows={3}
        cols={10}
        className="w-[75%] h-[12vh] focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-[0.95rem] placeholder-gray-400 p-2 bg-transparent rounded-md border-2 border-gray-500"
        placeholder={"Send Message!"}
      />
      <div className="w-[15%] h-[10vh] bg-indigo-400 rounded-md flex justify-center items-center transition-transform ease-in-out duration-200 hover:cursor-pointer hover:scale-105 hover:bg-indigo-500">
        <LuSendHorizontal className="text-[2rem] text-white" />
      </div>
    </div>
  );
};

export default MessageInput;
