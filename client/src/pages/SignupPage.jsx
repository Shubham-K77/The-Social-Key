/* eslint-disable react/no-unescaped-entities */
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../slices/userInfo";
import axios from "axios";
const SignupPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("first");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [digit, setDigit] = useState(["", "", "", "", "", ""]);
  const [background, setBackground] = useState("/Images/signup3.png");
  const theme = useSelector((state) => state.themeToggler.theme);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  //First Phase:
  const phaseFirst = async () => {
    if (name.length < 0 || !name) {
      setName("");
      return enqueueSnackbar("Name is Missing!", { variant: "error" });
    }
    if (username.length < 0 || !username) {
      setUsername("");
      return enqueueSnackbar("Username is Missing!", { variant: "error" });
    }
    const usernameRegex = /^(?=.{3,20}$)(?!_)(?!.*__)[a-zA-Z0-9_]+(?<!_)$/;
    const validUsername = usernameRegex.test(username);
    if (!validUsername) {
      setUsername("");
      return enqueueSnackbar(
        "Usernames must be 3-20 characters, use letters, numbers, or underscores, and avoid starting, ending, or consecutive underscores.",
        { variant: "error" }
      );
    }
    if (email.length < 0 || !email) {
      setEmail("");
      return enqueueSnackbar("Email is Missing!", { variant: "error" });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = emailRegex.test(email);
    if (!validEmail) {
      setEmail("");
      return enqueueSnackbar(
        "Enter a valid email format (e.g., name@example.com).",
        { variant: "error" }
      );
    }
    if (password.length < 0 || !password) {
      setPassword("");
      return enqueueSnackbar("Password is Missing!", { variant: "error" });
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const validPassword = passwordRegex.test(password);
    if (!validPassword) {
      setPassword("");
      return enqueueSnackbar(
        "Password must be 8+ characters with uppercase, lowercase, digit, and special character.",
        { variant: "error" }
      );
    }
    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      return enqueueSnackbar("Passwords do not match. Please re-enter.", {
        variant: "error",
      });
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5555/api/v1/users/register",
        { name, username, email, password }
      );
      enqueueSnackbar(response.data.message, {
        variant: "success",
      });
      setLoading(false);
      return setPhase("second");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred!";
      enqueueSnackbar(errorMessage, { variant: "error" });
      setLoading(false);
    }
  };
  // OTP Logic!
  const appendDigits = (e, value, index) => {
    if (isNaN(value) || value === "") {
      return false;
    }
    const updatedDigit = [...digit];
    updatedDigit[index] = value;
    setDigit(updatedDigit);
    e.target.nextSibling.focus();
  };
  //OTP Handling!
  const secondPhase = async () => {
    const otp = digit.join("");
    if (otp.length < 6) {
      setDigit(["", "", "", "", "", ""]);
      return enqueueSnackbar("Otp Must Be Six Digits!", { variant: "error" });
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5555/api/v1/users/validateOtp",
        { username, otp }
      );
      enqueueSnackbar(response.data.message, { variant: "success" });
      setLoading(false);
      return setPhase("third");
    } catch (error) {
      const errorMessage =
        error.response.data.message || "An unexpected error occurred!";
      enqueueSnackbar(errorMessage, { variant: "error" });
      setLoading(false);
    }
  };
  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await axios.get(
        "http://localhost:5555/api/v1/users/token",
        {
          withCredentials: true,
        }
      );
      if (response.data.userInfo) {
        dispatch(setUserInfo(response.data.userInfo));
        navigate("/main");
      }
    };
    checkLoginStatus();
    switch (phase) {
      case "first":
        setBackground("/Images/signup3.png");
        break;
      case "second":
        setBackground("/Images/signup2.png");
        break;
      case "third":
        setBackground("/Images/signup1.png");
        break;
      default:
        setBackground("/Images/signup3.png");
    }
  }, [phase, dispatch, navigate]);
  return (
    <div
      className={`w-full flex flex-col justify-start items-center min-h-screen overflow-x-hidden ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <Navbar />
      <div className="w-[95%] h-[270vh] lg:h-[170vh] mb-2 bg-transparent flex flex-col justify-start items-center lg:flex-row lg:justify-around lg:items-center p-2">
        <div className="w-full h-[110vh] lg:w-[40%] lg:h-[135vh] bg-transparent flex flex-col justify-evenly items-center">
          <div
            className="w-[95%] h-[90vh] lg:w-[80%] lg:h-[125vh] shadow-md rounded-sm"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="w-[80%] h-[15vh] bg-transparent flex justify-center items-center">
            <div
              className={`w-[25%] h-[2vh] rounded-md mr-2 ${
                phase === "first"
                  ? theme === "light"
                    ? "bg-rose-400"
                    : "bg-blue-500"
                  : theme === "light"
                  ? "border-2 border-rose-400"
                  : "border-2 border-blue-500"
              }`}
            ></div>
            <div
              className={`w-[25%] h-[2vh] rounded-md mr-2 ${
                phase === "second"
                  ? theme === "light"
                    ? "bg-rose-400"
                    : "bg-blue-500"
                  : theme === "light"
                  ? "border-2 border-rose-400"
                  : "border-2 border-blue-500"
              }`}
            ></div>
            <div
              className={`w-[25%] h-[2vh] rounded-md mr-2 ${
                phase === "third"
                  ? theme === "light"
                    ? "bg-rose-400"
                    : "bg-blue-500"
                  : theme === "light"
                  ? "border-2 border-rose-400"
                  : "border-2 border-blue-500"
              }`}
            ></div>
          </div>
        </div>
        <div
          className={`w-[90%] lg:w-[50%] h-[155vh] bg-transparent flex flex-col justify-start items-center ${
            phase === "third" ? "h-[50vh] lg:h-[155vh]" : "h-[155vh]"
          }`}
        >
          {phase === "first" ? (
            <>
              <div className="mt-[2rem] w-[90%] lg:h-[20vh] bg-transparent flex flex-col justify-evenly items-center mb-[2rem]">
                <div className="text-[2.25rem] font-bold mb-2">
                  Create Account
                </div>
                <div className="text-[1rem]">
                  Sign up with accurate details to create your account
                </div>
              </div>
              <div className="w-[95%] lg:w-[90%] h-[115vh] bg-transparent mb-[2rem] flex flex-col justify-start items-start">
                <div className="text-[1.25rem] font-bold lg:ml-[2rem] mt-[2rem] mb-2">
                  Name
                </div>
                <div className="w-[95%] lg:w-[80%] mb-[0.15rem] lg:ml-[2rem] font-openSans">
                  <input
                    type="text"
                    value={name}
                    className="w-full h-[7vh] text-[0.90rem] font-bold rounded-md p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="text-[1.25rem] font-bold lg:ml-[2rem] mt-[2rem] mb-2">
                  Username
                </div>
                <div className="w-[95%] lg:w-[80%] mb-[0.15rem] lg:ml-[2rem] font-openSans">
                  <input
                    type="text"
                    value={username}
                    className="w-full h-[7vh] text-[0.90rem] font-bold rounded-md p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="text-[1.25rem] font-bold lg:ml-[2rem] mt-[2rem] mb-2">
                  Email
                </div>
                <div className="w-[95%] lg:w-[80%] mb-[0.15rem] lg:ml-[2rem] font-openSans">
                  <input
                    type="text"
                    value={email}
                    className="w-full h-[7vh] text-[0.90rem] font-bold rounded-md p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="text-[1.25rem] font-bold lg:ml-[2rem] mt-[2rem] mb-2">
                  Password
                </div>
                <div className="w-[95%] lg:w-[80%] mb-[0.15rem] lg:ml-[2rem] font-openSans">
                  <input
                    type="password"
                    value={password}
                    className="w-full h-[7vh] text-[0.90rem] font-bold rounded-md p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-[1.25rem] font-bold lg:ml-[2rem] mt-[2rem] mb-2">
                  Confirm Password
                </div>
                <div className="w-[95%] lg:w-[80%] mb-[2rem] lg:mb-[1rem] lg:ml-[2rem] font-openSans">
                  <input
                    type="password"
                    value={confirmPassword}
                    className="w-full h-[7vh] text-[0.90rem] font-bold rounded-md p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Re-enter your password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div
                  className={`lg:ml-[2rem] w-[95%] lg:w-[90%] h-[7.5vh] rounded-md shadow-md text-[1.25rem] font-bold mt-[1rem] flex justify-center items-center transition-transform ease-in-out duration-150 hover:scale-105 ${
                    theme === "light"
                      ? "bg-rose-400 text-black hover:bg-rose-500 hover:cursor-pointer"
                      : "bg-sky-400 text-white hover:bg-sky-500 hover:cursor-pointer"
                  } ${loading === true ? "animate-pulse" : ""}`}
                  onClick={() => phaseFirst()}
                >
                  Next
                </div>
              </div>
              <div className="w-[90%] h-[10vh] bg-transparent mb-[2rem] flex justify-center items-center">
                <div className="mr-2 text-[1rem]">Already have an account?</div>
                <div
                  className="text-[1.05rem] font-bold hover:cursor-pointer hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </div>
              </div>
            </>
          ) : phase === "second" ? (
            <div className="w-full flex flex-col justify-start items-center">
              <div className="w-[95%] h-[30vh] lg:h-[20vh] bg-transparent mt-[4rem] flex flex-col justify-center items-center mb-[2rem]">
                <div className="text-[2.25rem] font-bold mb-2">
                  Verify Your Email
                </div>
                <div className="text-[1rem] flex justify-center items-center">
                  Enter the otp sent to your email
                </div>
              </div>
              <div className="w-full lg:w-[95%] h-[80vh] lg:h-[100vh] bg-transparent flex flex-col justify-center items-center mb-[2rem]">
                <div className="w-full flex justify-center items-center mb-[2.5rem] lg:mb-[1rem]">
                  <div className="text-[1.05rem] lg:text-[1.20rem] text-justify flex justify-center items-center mb-[2rem]">
                    Please verify your email to successfully create your login
                    credentials
                  </div>
                </div>
                <div className="w-full lg:w-[95%] flex justify-center items-center mb-[2rem]">
                  {digit.map((digit, i) => (
                    <input
                      key={i} // Adding a unique key for each input
                      type="text"
                      maxLength={1}
                      className="w-[12.5vw] h-[8vh] lg:w-[10%] lg:h-[9.5vh] rounded-md text-black text-center text-[1.25rem] focus:outline-none focus:ring-2 focus:border-green-500 focus:ring-green-500 mr-2"
                      value={digit}
                      onChange={(e) => appendDigits(e, e.target.value, i)}
                    />
                  ))}
                </div>
                <div
                  className={`w-[95%] h-[8vh] rounded-md flex justify-center items-center text-[1.05rem] font-bold hover:cursor-pointer transition-transform ease-in-out duration-150 hover:scale-105 ${
                    theme === "light"
                      ? "bg-rose-400 hover:bg-rose-500 text-black"
                      : "bg-sky-500 hover:bg-sky-600 text-white"
                  } ${loading === true ? "animate-pulse" : ""} `}
                  onClick={() => secondPhase()}
                >
                  Verify
                </div>
              </div>
              <div className="w-[95%] h-[15vh] bg-transparent flex justify-center items-center">
                <div className="mr-2 text-[1rem]">Don't have an account?</div>
                <div
                  className="text-[1.05rem] font-bold hover:cursor-pointer hover:underline"
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[55vh] lg:h-full flex flex-col justify-center items-center">
              <div className="w-[95%] h-[20vh] flex justify-center items-center bg-transparent mb-[2rem]">
                <div className="text-[3.25rem] font-bold mb-[1rem]">
                  Success!
                </div>
              </div>
              <div className="text-[1.05rem] mb-[2rem] pl-2 lg:pl-0 text-justify">
                Your credentials have been successfully verified. You can now
                log in to the platform and access all its features.
              </div>
              <div
                className={`w-[95%] h-[9.5vh] mt-[2rem] flex justify-center items-center rounded-md hover:cursor-pointer font-bold text-[1.25rem] shadow-md transition-transform ease-in-out duration-150 hover:scale-105 ${
                  theme === "light"
                    ? "bg-rose-400 text-black hover:bg-rose-500"
                    : "bg-sky-500 text-white hover:bg-sky-600"
                }`}
                onClick={() => navigate("/login")}
              >
                Login
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SignupPage;
