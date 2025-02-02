/* eslint-disable react/prop-types */
const Message = ({ ownMessage }) => {
  return (
    <div
      className={`w-full bg-transparent flex flex-row items-center mb-2 p-2 transition-all ease-in-out duration-150 hover:cursor-pointer hover:scale-105 ${
        ownMessage ? "justify-start" : "justify-end"
      }`}
    >
      {ownMessage ? (
        <>
          <div className="w-[60%] lg:w-[80%] flex flex-col justify-start items-end text-white bg-green-300 p-2 rounded-md">
            <div className="text-[1.05rem] font-semibold mb-2">username</div>
            <div className="text-[0.95rem] lg:text-[0.85rem] text-right">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil id
              aliquam rem voluptas culpa repellat deleniti recusandae error
              reiciendis animi.
            </div>
          </div>
          <div className="w-[32%] lg:w-[12%] h-[12vh] rounded-[50%] bg-sky-700 shadow-md ml-4"></div>
        </>
      ) : (
        <>
          <div className="w-[32%] lg:w-[11.5%] h-[12vh] rounded-[50%] bg-sky-700 shadow-md mr-4"></div>
          <div className="w-[60%] lg:w-[80%] flex flex-col justify-start items-start bg-sky-400 text-white p-2 rounded-md">
            <div className="text-[1.05rem] font-semibold mb-2">username</div>
            <div className="text-[0.95rem] lg:text-[0.85rem]">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea
              temporibus veniam voluptatum voluptates. Aperiam, quasi.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
