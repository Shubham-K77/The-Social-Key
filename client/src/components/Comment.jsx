/* eslint-disable react/prop-types */
const Comment = ({ reply }) => {
  return (
    <div className="flex justify-around items-center w-full h-[26vh] lg:h-[22vh] rounded-md bg-transparent mb-2 hover:cursor-pointer hover:bg-slate-50 hover:text-black">
      <div
        className="w-[16.5%] lg:w-[9%] h-[8vh] shadow-md rounded-[50%]"
        style={{
          backgroundImage: `url('${
            reply.userProfilePic || "/Images/avatar.png"
          }')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="w-[85%] h-[24vh] lg:h-[18vh] flex flex-col justify-center items-start bg-transparent ml-2">
        <div className="h-[4vh] flex justify-around items-center">
          <div className="text-[1rem] font-roboto font-bold mr-4">
            {reply.username}
          </div>
        </div>
        <div className="text-[0.90rem] font-roboto">{reply.text}</div>
      </div>
    </div>
  );
};
export default Comment;
