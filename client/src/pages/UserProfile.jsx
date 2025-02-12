/* eslint-disable react/no-unescaped-entities */
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { setUserInfo } from "../../slices/userInfo";
import ProfileHead from "../components/ProfileHead";
import UserPost from "../components/UserPost";
import Navbar from "../components/Navbar";
import { FaSpinner } from "react-icons/fa";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.themeToggler.theme);
  const [display, setDisplay] = useState("Imprints");
  const [userExist, setUserExist] = useState(true);
  const [userProfileData, setUserProfileData] = useState(null);
  const [postsInfo, setPostInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleDisplay = (value) => {
    if (display !== value) {
      setDisplay(value);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        "https://the-social-key-api.vercel.app/api/v1/users/token",
        { withCredentials: true }
      );
      if (response.data.userInfo) {
        dispatch(setUserInfo(response.data.userInfo));
      }
    };
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const profileResponse = await axios.get(
          `https://the-social-key-api.vercel.app/api/v1/users/profile/${username}`
        );
        if (
          !profileResponse.data.userExists ||
          profileResponse.data.userExists.isFrozen
        ) {
          setUserExist(false);
          setPostInfo([]);
          return enqueueSnackbar("This Account Has Been Frozen!", {
            variant: "error",
          });
        }
        if (profileResponse.data.userExists) {
          setUserProfileData(profileResponse.data.userExists);
          setUserExist(true);
          // Fetch user posts
          const postsResponse = await axios.get(
            `https://the-social-key-api.vercel.app/api/v1/posts/user/${username}`,
            { withCredentials: true }
          );
          setPostInfo(postsResponse.data.postInfo || []);
          enqueueSnackbar(postsResponse.data.message, { variant: "success" });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "User Not Found!";
        enqueueSnackbar(errorMessage, { variant: "error" });
        setUserExist(false);
        setPostInfo([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <div
        className={`w-full min-h-screen flex justify-center items-center ${
          theme === "light"
            ? "bg-gray-100 text-gray-900"
            : "bg-gray-900 text-gray-100"
        }`}
      >
        <FaSpinner className="text-4xl animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <Navbar />
      <div className="w-full min-h-screen flex justify-center items-center mt-2">
        {userExist ? (
          <div className="mt-8 mb-8 w-[90%] lg:w-[45%] bg-transparent flex flex-col justify-start items-start">
            {userProfileData && (
              <ProfileHead userProfileData={userProfileData} />
            )}
            <div className="w-full bg-transparent flex flex-col">
              <div className="h-[10vh] flex justify-around items-center bg-transparent">
                <div
                  className={`w-[50%] text-[1.25rem] border-b-2 border-slate-400 text-center ${
                    display === "Imprints"
                      ? "border-b-4 font-bold text-[1.3rem]"
                      : ""
                  } hover:cursor-pointer`}
                  onClick={() => toggleDisplay("Imprints")}
                >
                  Posts
                </div>
                <div
                  className={`w-[50%] text-[1.25rem] border-b-2 border-slate-400 text-center hover:cursor-pointer ${
                    display === "Echoes"
                      ? "border-b-4 font-bold text-[1.3rem]"
                      : ""
                  }`}
                  onClick={() => toggleDisplay("Echoes")}
                >
                  Replies
                </div>
              </div>

              <div className="mt-4">
                {display === "Imprints" ? (
                  postsInfo.length > 0 ? (
                    postsInfo.map((post) => (
                      <UserPost
                        key={post._id}
                        post={post}
                        setFeedPost={setPostInfo}
                      />
                    ))
                  ) : (
                    <div className="w-full py-8 text-center text-xl">
                      No posts found for this user. Start sharing your first
                      post today!
                    </div>
                  )
                ) : (
                  <div className="w-full py-8 text-center text-xl">
                    No Replies Yet!
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[95%] lg:w-full flex flex-col justify-evenly items-center lg:text-justify">
            <div className="text-[1.28rem] lg:text-[1.5rem] font-openSans mb-2 font-bold">
              Sorry, this page isn't available.
            </div>
            <div className="text-[0.90rem] lg:text-[1.15rem] font-openSans text-center">
              The link you followed may be broken, or the page may have been
              removed / User Doesn't Exist.
            </div>
            <div
              className="text-[1.05rem] font-bold mt-8 hover:cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Go Back: The Social Key
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
