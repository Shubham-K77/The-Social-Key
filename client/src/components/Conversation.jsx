const Conversation = () => {
  return (
    <div className="w-[95%] h-[12vh] flex justify-around items-center bg-purple-500 mb-2 mt-2 hover:cursor-pointer transition-all ease-in-out hover:scale-105">
      <div
        className="w-[17%] h-[8vh] lg:w-[18%] lg:h-[7.5vh] rounded-[50%] shadow-md"
        style={{
          backgroundImage: `url('/Images/ppElon.webp')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="w-[75%] h-[11vh] flex flex-col justify-start items-start p-2 bg-green-500">
        <div className="text-[1.05rem] font-semibold"> Username </div>
        <div className="text-[0.95rem]">Latest Message</div>
      </div>
    </div>
  );
};

export default Conversation;
