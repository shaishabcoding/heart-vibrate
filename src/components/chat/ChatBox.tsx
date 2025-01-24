import { IconBrandTelegram } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "bot",
      logo: "https://picsum.photos/40",
    },
    {
      id: 2,
      text: "I need some information about your services.",
      sender: "user",
      logo: "https://picsum.photos/40",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSelectedMessage(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          sender: "user",
          logo: "https://picsum.photos/40",
        },
      ]);
      setNewMessage("");
    }
  };

  const handleEditMessage = (id: number, newText: string | null) => {
    if (newText !== null) {
      setMessages(
        messages.map((message) =>
          message.id === id ? { ...message, text: newText } : message
        )
      );
    }
    setSelectedMessage(null);
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter((message) => message.id !== id));
    setSelectedMessage(null);
  };

  const handleReactMessage = (id: number, reaction: string) => {
    // Handle reaction logic here
    console.log(`Message with id ${id} reacted with ${reaction}`);
    setSelectedMessage(null);
  };

  const handleMouseDown = (id: number) => {
    const timeout = setTimeout(() => {
      setSelectedMessage(id);
    }, 500); // Adjust the duration for the hold time
    setHoldTimeout(timeout);
  };

  const handleMouseUp = () => {
    if (holdTimeout) {
      clearTimeout(holdTimeout);
      setHoldTimeout(null);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-l-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender !== "user" && (
              <img
                src={message.logo}
                alt="logo"
                className="h-10 w-10 rounded-full mr-2"
              />
            )}
            <div
              className={`relative max-w-xs p-3 my-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onMouseDown={() => handleMouseDown(message.id)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {message.text}
              {selectedMessage === message.id && (
                <div
                  ref={menuRef}
                  className="absolute top-0 right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg z-10"
                >
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() =>
                      handleEditMessage(
                        message.id,
                        prompt("Edit message:", message.text)
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleReactMessage(message.id, "👍")}
                  >
                    React
                  </button>
                </div>
              )}
            </div>
            {message.sender === "user" && (
              <img
                src={message.logo}
                alt="logo"
                className="h-10 w-10 rounded-full ml-2"
              />
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="ml-2 p-2 text-white rounded-lg flex justify-center bg-blue-600 group/btn-send relative outline-none focus:outline-none active:animate-click" 
            onClick={handleSendMessage}
          >
            <span className="group-hover/btn-send:translate-x-40 text-center transition duration-500">
              Send
            </span>
            <div className="-translate-x-40 group-hover/btn-send:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
              <IconBrandTelegram className="inline" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
