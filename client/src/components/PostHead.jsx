/* eslint-disable react/prop-types */
import { useSnackbar } from "notistack";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
const PostHead = ({ username, pid, pp, days }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const copyPostLink = () => {
    const url = `https://the-social-key.vercel.app/${username}/post/${pid}`;
    navigator.clipboard.writeText(url);
    enqueueSnackbar("Successfully Copied URL!", { variant: "success" });
  };
  return (
    <div className="w-full lg:w-[95%] h-[30vh] flex justify-evenly lg:justify-around bg-transparent mb-2">
      <div className="flex justify-evenly lg:justify-around items-center w-[70%] lg:w-[50%] bg-transparent p-2">
        <div
          className="w-[37.5%] h-[10.5vh] lg:w-[35%] lg:h-[15vh] rounded-[50%] shadow-md mr-2 hover:cursor-pointer"
          style={{
            backgroundImage: `url('${pp || "/Images/avatar.png"}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          onClick={() => navigate(`/${username}`)}
        ></div>
        <div
          className="text-[1.35rem] lg:text-[1.35rem] font-bold mr-2 ml-1 lg:ml-0 hover:underline hover:cursor-pointer"
          onClick={() => navigate(`/${username}`)}
        >
          {username}
        </div>
      </div>
      <div className="w-[25%] lg:w-[25%] flex justify-evenly lg:justify-around items-center">
        <div className="text-[0.75rem] lg:text-[0.85rem] font-semibold mr-2 w-full">
          {formatDistanceToNow(new Date(days))} ago
        </div>
        <BsThreeDots
          className="text-[2.5rem] lg:text-[2rem] font-bold hover:animate-pulse hover:cursor-pointer hidden w-[0%] lg:block lg:w-[20%]"
          onClick={() => {
            copyPostLink();
          }}
        />
      </div>
    </div>
  );
};

export default PostHead;
