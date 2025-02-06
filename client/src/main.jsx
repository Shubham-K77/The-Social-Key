import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "../slices/store";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { SocketContextProvider } from "../context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  //StrictMode renders every component twice! On Development Mode!
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
