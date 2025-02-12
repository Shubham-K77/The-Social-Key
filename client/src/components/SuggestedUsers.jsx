/* eslint-disable no-constant-binary-expression */
import axios from "axios";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
const SuggestedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const currentTheme = useSelector((state) => state.themeToggler.theme);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  useEffect(() => {
    const getSuggestion = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://the-social-key-api.vercel.app/api/v1/users/suggested",
          { withCredentials: true }
        );
        const usersWithFollowState = response?.data?.suggestedUsers.map(
          (user) => ({
            ...user,
            following: false,
          })
        );
        setSuggestedUsers(usersWithFollowState);
        enqueueSnackbar("Suggestion List Prepared!", { variant: "success" });
        setLoading(false);
      } catch (error) {
        let message = "Internal Error!" || error.response.data.message;
        enqueueSnackbar(message, { variant: "error" });
        setLoading(false);
      }
    };
    getSuggestion();
  }, [enqueueSnackbar]);

  // Follow/Unfollow The User:
  const followUnfollow = async (userId) => {
    try {
      const response = await axios.post(
        `https://the-social-key-api.vercel.app/api/v1/users/follow/${userId}`,
        {},
        { withCredentials: true }
      );
      let message = response.data.message;
      setSuggestedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, following: !user.following } : user
        )
      );

      enqueueSnackbar(message, { variant: "success" });
    } catch (error) {
      let message = "Internal Server Error!" || error.response.data.message;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-start">
      <div className="ml-2 mb-2 mt-2 text-[1.25rem] font-semibold">
        Suggested Users
      </div>
      <div className="w-full bg-transparent flex flex-col justify-evenly items-center">
        {/* If Loading Is True: */}
        {loading &&
          [0, 1, 2].map((element) => (
            <div
              className="w-full h-[12vh] bg-transparent mb-2 flex justify-evenly items-center"
              key={element}
            >
              <div className="w-[20%] lg:w-[16%] h-[10vh] rounded-[50%] bg-gray-500 animate-pulse"></div>
              <div className="w-[55%] h-[10vh] bg-transparent flex flex-col justify-start items-start p-2">
                <div className="w-[55%] h-[2vh] rounded-lg bg-gray-500 mb-2 animate-pulse"></div>
                <div className="w-[45%] h-[2vh] rounded-lg bg-gray-500 animate-pulse"></div>
              </div>
              <div className="w-[25%] h-[8vh] bg-gray-500 rounded-md animate-pulse"></div>
            </div>
          ))}
        {/* Loading Is False! Map Suggested Users!*/}
        {!loading &&
          (suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
              <div
                key={user._id}
                className={`w-full h-[15vh] bg-transparent mt-2 mb-[1rem] flex justify-evenly items-center transition-all ease-in-out duration-200 hover:scale-105 hover:cursor-pointer ${
                  currentTheme === "light"
                    ? "hover:bg-gray-300"
                    : "hover:bg-gray-600"
                }`}
                onClick={() => navigate(`/${user.username}`)}
              >
                <div
                  className="w-[20%] lg:w-[16%] h-[10vh] rounded-[50%] shadow-md"
                  style={{
                    backgroundImage: `url(${
                      user.profilePic || "/Images/avatar.png"
                    })`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="w-[55%] h-[10vh] bg-transparent flex flex-col justify-start items-start p-2">
                  <div className="text-[1rem] mb-1">{user.name}</div>
                  <div className="text-[1.05rem]">@{user.username}</div>
                </div>
                <div
                  className={`w-[25%] h-[8vh] rounded-md flex justify-center items-center text-white text-[1rem] font-semibold hover:cursor-pointer shadow-md ${
                    !user.following
                      ? "bg-green-400 hover:bg-green-500"
                      : "bg-sky-400 hover:bg-sky-500"
                  }`}
                  onClick={() => followUnfollow(user._id)}
                >
                  {!user.following ? "Follow" : "Unfollow"}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-[20vh] flex justify-center items-center text-[1.05rem] font-semibold">
              No Suggestions Right Now!
            </div>
          ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
