/* eslint-disable react/no-unescaped-entities */
// Imports:
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setUserInfo } from "../../slices/userInfo";
import { useSnackbar } from "notistack";
import axios from "axios";
//Recharts:
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
// Icons:
import { FaUsers } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
import { FaImages } from "react-icons/fa";
import { RiDvdAiFill } from "react-icons/ri";
import { SlUserFollowing } from "react-icons/sl";
const DashBoard = () => {
  // Constants
  const theme = useSelector((state) => state.themeToggler.theme);
  const currentUser = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDate = format(new Date(), "dd-MM-yyyy");
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const [userPosts, setUserPosts] = useState([]);
  const [latestPost, setLatestPost] = useState({});
  const [recentFollower, setRecentFollower] = useState({});
  const [recentLike, setRecentLike] = useState({});
  const [recentReply, setRecentReply] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // Handle payment confirmation
  useEffect(() => {
    const pidx = searchParams.get("pidx");
    const status = searchParams.get("status");
    if (pidx && status === "Completed" && !isProcessingPayment) {
      const confirmPayment = async () => {
        setIsProcessingPayment(true);
        try {
          const response = await axios.post(
            `https://the-social-key-api.vercel.app/api/v1/payments/confirm/${pidx}`,
            {},
            { withCredentials: true }
          );
          if (response.data.success) {
            const userResponse = await axios.get(
              "https://the-social-key-api.vercel.app/api/v1/users/token",
              { withCredentials: true }
            );
            if (userResponse.data.userInfo) {
              dispatch(setUserInfo(userResponse.data.userInfo));
              enqueueSnackbar(
                `Payment successful! Your new credit balance is ${userResponse.data.userInfo.credit}`,
                { variant: "success" }
              );
            }
          }
        } catch (error) {
          enqueueSnackbar(
            error.response?.data?.message || "Payment confirmation failed",
            { variant: "error" }
          );
        } finally {
          setIsProcessingPayment(false);
          navigate("/dashboard", { replace: true });
        }
      };
      confirmPayment();
    }
  }, [searchParams, dispatch, navigate, enqueueSnackbar, isProcessingPayment]);
  //Fetch The Current User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://the-social-key-api.vercel.app/api/v1/users/token",
          { withCredentials: true }
        );
        if (response.data.userInfo) {
          dispatch(setUserInfo(response.data.userInfo));
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "User is not authenticated.";
        enqueueSnackbar(errorMessage, { variant: "error" });
        navigate("/");
      }
    };
    fetchUser();
  }, [currentUser, dispatch, enqueueSnackbar, navigate]);
  //To Fetch The Post Of Users
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        `https://the-social-key-api.vercel.app/api/v1/posts/user/${currentUser?.username}`
      );
      setUserPosts(response?.data?.postInfo);
    };
    fetchPosts();
    //Fetch The Latest Follower, Like And Comment Logic
    const sortedPosts = userPosts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    if (sortedPosts?.length > 0) {
      setLatestPost(sortedPosts[0]);
    }
  }, [currentUser?.username, userPosts]);
  //Initiate The Payment
  const initiatePayment = async (credits, totalPrice) => {
    try {
      setIsProcessingPayment(true);
      const userResponse = await axios.get(
        "https://the-social-key-api.vercel.app/api/v1/users/token",
        { withCredentials: true }
      );
      if (userResponse.data.userInfo) {
        dispatch(setUserInfo(userResponse.data.userInfo));
      }
      const response = await axios.post(
        "https://the-social-key-api.vercel.app/api/v1/payments/pay",
        {
          credits,
          totalPrice,
        },
        { withCredentials: true }
      );
      window.location.href = response.data.data.payment_url;
    } catch (error) {
      let errorMessage =
        error.response?.data?.message || "Unable To Initiate Payment";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsProcessingPayment(false);
    }
  };
  //Total Likes Counter
  let sumLikes = 0;
  userPosts.map((post) => {
    sumLikes += post.likes.length;
  });
  //Total Comments Counter
  let sumReplies = 0;
  userPosts.map((post) => {
    sumReplies += post.replies.length;
  });
  let humanPosts = 0;
  let AIPosts = 0;
  userPosts.map((post) => {
    post.postType === "AI" ? AIPosts++ : humanPosts++;
  });
  //Pie-Chart 2
  const humanVsAIData = [
    {
      name: "AI",
      value: AIPosts,
      fill: theme === "light" ? "#ec4899" : "#f472b6",
    },
    {
      name: "Human",
      value: humanPosts,
      fill: theme === "light" ? "#3b82f6" : "#60a5fa",
    },
  ];
  //Pie-Chart 1
  const pieChartData = [
    {
      name: "Likes",
      value: sumLikes,
      fill: theme === "light" ? "#ec4899" : "#f472b6",
    },
    {
      name: "Comments",
      value: sumReplies,
      fill: theme === "light" ? "#3b82f6" : "#60a5fa",
    },
  ];
  //Latest Stats User
  const latestFollower =
    currentUser?.followers?.[currentUser?.followers?.length - 1];
  const latestLike = latestPost?.likes?.[latestPost?.likes?.length - 1];
  const latestComment =
    latestPost?.replies?.[latestPost?.replies?.length - 1]?.userId;
  //Fetch Latest Informations
  useEffect(() => {
    const fetchLatestFollower = async () => {
      if (latestFollower) {
        const response = await axios.get(
          `https://the-social-key-api.vercel.app/api/v1/users/userInfo/${latestFollower}`
        );
        setRecentFollower(response.data.userExists);
      }
    };
    const fetchLatestLike = async () => {
      if (latestLike) {
        const response = await axios.get(
          `https://the-social-key-api.vercel.app/api/v1/users/userInfo/${latestLike}`
        );
        setRecentLike(response.data.userExists);
      }
    };
    const fetchLatestComment = async () => {
      if (latestComment) {
        const response = await axios.get(
          `https://the-social-key-api.vercel.app/api/v1/users/userInfo/${latestComment}`
        );
        setRecentReply(response.data.userExists);
      }
    };
    fetchLatestFollower();
    fetchLatestLike();
    fetchLatestComment();
  }, [latestComment, latestFollower, latestLike]);

  //For Bar-Graph
  const postsSummary = userPosts.map((post, index) => ({
    name: `Post-${index + 1}`,
    likes: post.likes.length,
    replies: post.replies.length,
  }));

  //Render
  return (
    <div
      className={`w-full min-h-screen flex flex-col justify-start items-center ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <Navbar />
      <div className="w-full lg:w-[95%] h-[20vh] bg-transparent mt-[1rem] flex justify-around items-center">
        <div className="w-[55%] h-[18vh] bg-transparent flex flex-col justify-start items-center">
          <div className="text-[1.85rem] font-bold mb-2">Dashboard</div>
          <div
            className={`mb-2 rounded-md w-[85%] lg:w-[20%] h-[10vh] flex justify-center items-center shadow-md ${
              theme === "light"
                ? "bg-rose-400 text-black"
                : "bg-sky-500 text-white"
            }`}
          >
            <div className="text-[1.25rem] font-semibold">{currentDate}</div>
          </div>
        </div>
        <div className="w-[35%] h-[18vh] bg-transparent flex flex-col justify-start items-center lg:flex-row lg:justify-center lg:items-center">
          <div className="text-[1rem] lg:text-[1.5rem] font-bold mb-2 lg:ml-2 lg:mr-4 hover:underline">
            {currentUser?.username}
          </div>
          <div
            className="mb-2 w-[62%] lg:w-[17%] h-[15vh] lg:h-[12vh] bg-transparent rounded-[50%] shadow-md hover:cursor-pointer"
            title="Profile"
            onClick={() => navigate(`/${currentUser?.username}`)}
            style={{
              backgroundImage: `url(${
                currentUser?.profilePic || "/Images/avatar.png"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </div>
      {/* Main Screen */}
      <div className="w-[95%] bg-transparent mt-2 mb-2 flex flex-col justify-start items-center lg:flex-row lg:justify-around lg:items-start p-2">
        {/* Banner -1 */}
        <div className="w-[95%] lg:w-[70%] bg-transparent mb-2 lg:mb-0 flex flex-col justify-start items-center">
          {/* Platform Statstics */}
          <div className="w-full mt-2 mb-2 h-[82vh] lg:h-[80vh] bg-transparent flex flex-col justify-start items-center lg:flex-row lg:justify-evenly lg:items-center lg:flex-wrap">
            {/* Total Posts */}
            <div
              className={`w-[98%] h-[13vh] mb-2 lg:w-[32%] lg:h-[35vh] flex justify-around items-center rounded-md bg-transparent ${
                theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
              } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md`}
            >
              <div className="w-[70%] lg:w-[55%] flex flex-col justify-start items-center">
                <div className="text-[1.25rem] lg:text-[1.5rem] font-bold lg:mb-2">
                  Total Posts
                </div>
                <div className="text-[1.25rem] lg:text-[1.5rem] font-semibold lg:mb-2">
                  {userPosts?.length || 0}
                </div>
                <div className="text-[0.85rem] lg:text-[0.95rem] lg:mb-2">
                  {" "}
                  last 24 hours{" "}
                </div>
              </div>
              <div className="w-[22%] h-[10vh] lg:w-[26%] lg:h-[11.5vh] bg-teal-500 rounded-[50%] flex justify-center items-center">
                <FaImages className="text-[2rem] font-bold text-white" />
              </div>
            </div>
            {/* Total Followers */}
            <div
              className={`w-[98%] h-[13vh] mb-2 lg:w-[32%] lg:h-[35vh] flex justify-around items-center rounded-md bg-transparent ${
                theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
              } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md`}
            >
              <div className="w-[70%] lg:w-[55%] flex flex-col justify-start items-center">
                <div className="text-[1.25rem] lg:text-[1.5rem] font-bold lg:mb-2">
                  Total Followers
                </div>
                <div className="text-[1.25rem] lg:text-[1.5rem] font-semibold lg:mb-2">
                  {currentUser?.followers?.length}
                </div>
                <div className="text-[0.85rem] lg:text-[0.95rem] lg:mb-2">
                  {" "}
                  last 24 hours{" "}
                </div>
              </div>
              <div className="w-[22%] h-[10vh] lg:w-[26%] lg:h-[11.5vh] bg-indigo-500 rounded-[50%] flex justify-center items-center">
                <FaUsers className="text-[2rem] font-bold text-white" />
              </div>
            </div>
            {/* Total Likes */}
            <div
              className={`w-[98%] h-[13vh] mb-2 lg:w-[32%] lg:h-[35vh] flex justify-around items-center rounded-md bg-transparent ${
                theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
              } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md`}
            >
              <div className="w-[70%] lg:w-[55%] flex flex-col justify-start items-center">
                <div className="text-[1.25rem] lg:text-[1.5rem] font-bold lg:mb-2">
                  Total Likes
                </div>
                <div className="text-[1.25rem] lg:text-[1.5rem] font-semibold lg:mb-2">
                  {sumLikes || 0}
                </div>
                <div className="text-[0.85rem] lg:text-[0.95rem] lg:mb-2">
                  {" "}
                  last 24 hours{" "}
                </div>
              </div>
              <div className="w-[22%] h-[10vh] lg:w-[26%] lg:h-[11.5vh] bg-pink-500 rounded-[50%] flex justify-center items-center">
                <FaHeart className="text-[2rem] font-bold text-white" />
              </div>
            </div>
            {/* Total Comments */}
            <div
              className={`w-[98%] h-[13vh] mb-2 lg:w-[32%] lg:h-[35vh] flex justify-around items-center rounded-md bg-transparent ${
                theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
              } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md`}
            >
              <div className="w-[70%] lg:w-[55%] flex flex-col justify-start items-center">
                <div className="text-[1.25rem] lg:text-[1.5rem] font-bold lg:mb-2">
                  Total Comments
                </div>
                <div className="text-[1.25rem] lg:text-[1.5rem] font-semibold lg:mb-2">
                  {sumReplies || 0}
                </div>
                <div className="text-[0.85rem] lg:text-[0.95rem] lg:mb-2">
                  {" "}
                  last 24 hours{" "}
                </div>
              </div>
              <div className="w-[22%] h-[10vh] lg:w-[26%] lg:h-[11.5vh] bg-blue-600 rounded-[50%] flex justify-center items-center">
                <FaComments className="text-[2rem] font-bold text-white" />
              </div>
            </div>
            {/* Total Credits */}
            <div
              className={`w-[98%] h-[13vh] mb-2 lg:w-[32%] lg:h-[35vh] flex justify-around items-center rounded-md bg-transparent ${
                theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
              } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md`}
            >
              <div className="w-[70%] lg:w-[55%] flex flex-col justify-start items-center">
                <div className="text-[1.25rem] lg:text-[1.5rem] font-bold lg:mb-2">
                  Total Credits
                </div>
                <div className="text-[1.25rem] lg:text-[1.5rem] font-semibold lg:mb-2">
                  {currentUser?.credit}
                </div>
                <div className="text-[0.85rem] lg:text-[0.95rem] lg:mb-2">
                  {" "}
                  last 24 hours{" "}
                </div>
              </div>
              <div className="w-[22%] h-[10vh] lg:w-[26%] lg:h-[11.5vh] bg-amber-500 rounded-[50%] flex justify-center items-center">
                <RiDvdAiFill className="text-[2rem] font-bold text-white" />
              </div>
            </div>
            {/* Total Following */}
            <div
              className={`w-[98%] h-[13vh] mb-2 lg:w-[32%] lg:h-[35vh] flex justify-around items-center rounded-md bg-transparent ${
                theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
              } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md`}
            >
              <div className="w-[70%] lg:w-[55%] flex flex-col justify-start items-center">
                <div className="text-[1.25rem] lg:text-[1.5rem] font-bold lg:mb-2">
                  Total Following
                </div>
                <div className="text-[1.25rem] lg:text-[1.5rem] font-semibold lg:mb-2">
                  {currentUser?.following?.length}
                </div>
                <div className="text-[0.85rem] lg:text-[0.95rem] lg:mb-2">
                  {" "}
                  last 24 hours{" "}
                </div>
              </div>
              <div className="w-[22%] h-[10vh] lg:w-[26%] lg:h-[11.5vh] bg-gray-700 rounded-[50%] flex justify-center items-center">
                <SlUserFollowing className="text-[2rem] font-bold text-white" />
              </div>
            </div>
          </div>
          {/* Bar Graph */}
          <div className="w-[95%] h-[120vh] bg-transparent mb-2 flex flex-col justify-center items-center p-4">
            <div className="mb-6 mt-2 text-2xl font-bold">
              Activity Overview
            </div>
            <div className="w-full h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={postsSummary}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: theme === "light" ? "#374151" : "#9ca3af" }}
                    axisLine={{
                      stroke: theme === "light" ? "#6b7280" : "#9ca3af",
                    }}
                    tickLine={{
                      stroke: theme === "light" ? "#6b7280" : "#9ca3af",
                    }}
                  />
                  <YAxis
                    tick={{ fill: theme === "light" ? "#374151" : "#9ca3af" }}
                    axisLine={{
                      stroke: theme === "light" ? "#6b7280" : "#9ca3af",
                    }}
                    tickLine={{
                      stroke: theme === "light" ? "#6b7280" : "#9ca3af",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "light" ? "white" : "#1f2937",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                    cursor={{
                      fill: theme === "light" ? "#f3f4f6" : "#374151",
                      opacity: 0.2,
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                    }}
                  />
                  <Bar
                    dataKey="likes"
                    name="Likes"
                    fill={theme === "light" ? "#ec4899" : "#f472b6"}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                    animationDuration={1500}
                  />
                  <Bar
                    dataKey="replies"
                    name="Comments"
                    fill={theme === "light" ? "#3b82f6" : "#60a5fa"}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Banner- 2 */}
        <div className="w-[95%] lg:w-[25%] h-[200vh] bg-transparent mb-2 lg:mb-0 flex flex-col justify-start items-center">
          {/* Purchase Credits */}
          <div
            className={`w-[95%] h-[80vh] mt-2 mb-[1rem] bg-transparent flex flex-col justify-start items-center transition-transform ease-in-out hover:scale-105 hover:transition-transform hover:ease-in-out hover:rounded-md `}
          >
            <div className="mt-2 mb-2 text-[1.35rem] font-bold">
              Buy Credits
            </div>
            <div className="w-[95%] h-[48vh] lg:h-[40vh] bg-transparent rounded-md mb-2 flex flex-col justify-start items-center lg:flex-row lg:justify-center lg:items-center lg:flex-wrap">
              <div
                className={`w-[95%] h-[9.5vh] mb-2 mt-2 lg:mb-0 lg:w-[45%] lg:h-[18vh] lg:mr-2 bg-transparent rounded-md flex flex-row justify-around items-center lg:flex-col lg:justify-center lg:items-center ${
                  theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
                } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md hover:rounded-md hover:cursor-pointer`}
                onClick={() => initiatePayment(5, 20)}
              >
                <div className="text-[1.35rem] font-semibold lg:mb-2">
                  {" "}
                  5 Credits{" "}
                </div>
                <div className="text-[2.5rem]">🥱</div>
              </div>
              <div
                className={`w-[95%] h-[9.5vh] mb-2 mt-2 lg:mb-0 lg:w-[45%] lg:h-[18vh] lg:mr-2 bg-transparent rounded-md flex flex-row justify-around items-center lg:flex-col lg:justify-center lg:items-center  ${
                  theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
                } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md hover:rounded-md hover:cursor-pointer`}
                onClick={() => initiatePayment(10, 40)}
              >
                <div className="text-[1.35rem] font-semibold lg:mb-2">
                  {" "}
                  10 Credits{" "}
                </div>
                <div className="text-[2.5rem]">🪫</div>
              </div>
              <div
                className={`w-[95%] h-[9.5vh] mb-2 mt-2 lg:w-[45%] lg:h-[18vh] lg:mr-2 bg-transparent rounded-md flex flex-row justify-around items-center lg:flex-col lg:justify-center lg:items-center ${
                  theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
                } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md hover:rounded-md hover:cursor-pointer`}
                onClick={() => initiatePayment(15, 60)}
              >
                <div className="text-[1.35rem] font-semibold lg:mb-2">
                  {" "}
                  15 Credits{" "}
                </div>
                <div className="text-[2.5rem]">⚡</div>
              </div>
              <div
                className={`w-[95%] h-[9.5vh] mb-2 mt-2 lg:w-[45%] lg:h-[18vh] lg:mr-2 bg-transparent rounded-md flex flex-row justify-around items-center lg:flex-col lg:justify-center lg:items-center ${
                  theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
                } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md hover:rounded-md hover:cursor-pointer`}
                onClick={() => initiatePayment(20, 80)}
              >
                <div className="text-[1.35rem] font-semibold lg:mb-2">
                  {" "}
                  20 Credits{" "}
                </div>
                <div className="text-[2.5rem]">🔋</div>
              </div>
            </div>
          </div>
          {/* Latest Updates */}
          <div
            className={`w-[95%] h-[50vh] mt-2 rounded-md flex flex-col justify-start items-center bg-transparent ${
              theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
            } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md`}
          >
            {latestPost ? (
              <>
                <div className="mt-2 mb-2 text-[1.25rem] font-bold">
                  Latest Updates
                </div>
                {/* Latest Follower */}
                <div className="mt-2 mb-2 w-[95%] rounded-md h-[10vh] bg-transparent flex justify-start items-center">
                  {Object.keys(recentFollower).length > 0 ? (
                    <>
                      <div
                        className="w-[20%] lg:w-[18%] h-[8vh] rounded-[50%] ml-2 mr-2 shadow-md"
                        style={{
                          backgroundImage: `url(${
                            recentFollower.profilePic || "/Images/avatar.png"
                          })`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                      <div className="w-[80%] flex flex-col justify-start items-start">
                        <div className="text-[1.15rem] font-semibold">
                          {recentFollower.username}
                        </div>
                        <div className="text-[0.95rem]">
                          has started following you.
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="font-semibold text-[1.25rem]">
                      No followers yet.
                    </div>
                  )}
                </div>
                {/* Latest Like */}
                <div className="mt-2 mb-2 w-[95%] rounded-md h-[10vh] bg-transparent flex justify-start items-center">
                  {Object.keys(recentLike).length > 0 ? (
                    <>
                      <div
                        className="w-[18%] h-[8vh] rounded-[50%] ml-2 mr-2 shadow-md"
                        style={{
                          backgroundImage: `url(${
                            recentLike?.profilePic || "/Images/avatar.png"
                          })`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                      <div className="w-[80%] flex flex-col justify-start items-start">
                        <div className="text-[1.15rem] font-semibold">
                          {recentLike?.username}
                        </div>
                        <div className="text-[0.95rem]">
                          has liked your latest post.
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex justify-center">
                      <div className="font-semibold text-[1.15rem]">
                        No likes yet.
                      </div>
                    </div>
                  )}
                </div>
                {/* Latest Comment */}
                <div className="mt-2 mb-2 w-[95%] rounded-md h-[10vh] bg-transparent flex justify-start items-center">
                  {Object.keys(recentReply).length > 0 ? (
                    <>
                      <div
                        className="w-[18%] h-[8vh] rounded-[50%] ml-2 mr-2 shadow-md"
                        style={{
                          backgroundImage: `url(${
                            recentReply.profilePic || "/Images/avatar.png"
                          })`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                      <div className="w-[80%] flex flex-col justify-start items-start">
                        <div className="text-[1.15rem] font-semibold">
                          {recentReply?.username}
                        </div>
                        <div className="text-[0.95rem]">
                          has replied to your latest post.
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex justify-center">
                      <div className="font-semibold text-[1.15rem]">
                        No replies yet.
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-2 mb-2 text-[1.25rem] font-roboto text-justify">
                You haven't created any posts yet!
              </div>
            )}
          </div>
          {/* Pie-Chart */}
          <div
            className={`mt-[2rem] mb-[2rem] w-[95%] h-[70vh] flex flex-col justify-center items-center bg-transparent ${
              theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
            } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md`}
          >
            <div className="text-xl font-bold mb-4">
              Engagement Distribution
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    name,
                  }) => {
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x =
                      cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y =
                      cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text
                        x={x}
                        y={y}
                        fill={theme === "light" ? "black" : "white"}
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                      >
                        {`${name} (${(percent * 100).toFixed(0)}%)`}
                      </text>
                    );
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "light" ? "white" : "#6B7280",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    paddingTop: "20px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Pie Chart AI Vs Human */}
          <div
            className={`mt-[2rem] mb-[2rem] w-[95%] h-[70vh] flex flex-col justify-center items-center bg-transparent ${
              theme === "light" ? "hover:bg-slate-50" : "hover:bg-gray-700"
            } hover:transition-transform hover:ease-in-out hover:scale-105 hover:shadow-md`}
          >
            <div className="text-[1.30rem] font-bold mb-4">
              Post Type Distribution
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={humanVsAIData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    name,
                  }) => {
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x =
                      cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y =
                      cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text
                        x={x}
                        y={y}
                        fill={theme === "light" ? "black" : "white"}
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                      >
                        {`${name} (${(percent * 100).toFixed(0)}%)`}
                      </text>
                    );
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "light" ? "white" : "#6B7280",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    paddingTop: "20px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
