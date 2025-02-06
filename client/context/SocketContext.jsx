/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
const SocketContext = createContext();
export const useSocket = () => {
  return useContext(SocketContext);
};
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const currentUser = useSelector((state) => state.user.userInfo);
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    const socket = io("http://localhost:5555", {
      query: {
        userId: currentUser?._id,
      },
    });
    setSocket(socket);
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
    return () => socket && socket.close();
  }, [currentUser?._id]);

  console.log("Online Users!", onlineUsers);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
