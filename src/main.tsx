import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import Chat from "./pages/chats/Chat";
import Signup from "./pages/signup/Signup";
import ChatBox from "./components/chat/ChatBox";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "chat",
        element: <Chat />,
        children: [
          {
            path: ":id",
            element: <ChatBox />,
          },
        ],
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
