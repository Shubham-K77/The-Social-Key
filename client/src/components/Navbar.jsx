import { useDispatch, useSelector } from "react-redux";
import { colorChanger } from "../../slices/themeToggler";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const theme = useSelector((state) => state.themeToggler.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="w-[95%] h-[30vh] border-b-2 border-slate-400 mb-2 flex flex-col justify-center items-center">
      <div
        className="w-[50%] h-[18vh] lg:w-[15%] lg:h-[20vh] hover:cursor-pointer"
        title={"Change-Theme"}
        onClick={() => {
          dispatch(colorChanger());
        }}
        style={{
          backgroundImage:
            theme === "light"
              ? `url('/Images/logoSun.png')`
              : `url('/Images/logoMoon.png')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div
        className="text-[2rem] font-bold transition-transform duration-100 hover:text-yellow-500 hover:cursor-pointer mb-2 hover:underline hover:animate-pulse"
        title={"Home-Page"}
        onClick={() => {
          navigate("/");
        }}
      >
        The Social Key
      </div>
    </div>
  );
};

export default Navbar;
