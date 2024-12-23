import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js"; // Import highlight.js
import "highlight.js/styles/atom-one-dark.css";
import axios from "axios"; // For making API requests
import { API_KEY } from "../constant";

const CodeDisplay = ({ code, setCodeDisplay, onDownloadProject }) => {
  const [copySuccess, setCopySuccess] = useState(""); // State to show copy success message
  const [isChatMode, setIsChatMode] = useState(false); // State to toggle chat mode
  const [chatInput, setChatInput] = useState(""); // State for chat input
  const [chatMessages, setChatMessages] = useState([]); // State for chat messages
  const [currentCode, setCurrentCode] = useState(code); // State for displayed code
  const codeRef = useRef(null); // Ref to the <pre><code> block

  // Highlight code on component mount or code changes
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [currentCode]);

  // Handle copying code to clipboard
  const handleCopy = () => {
    navigator.clipboard
      .writeText(currentCode)
      .then(() => {
        setCopySuccess("Code copied!");
        setTimeout(() => {
          setCopySuccess("");
          setCodeDisplay(false);
        }, 700);
      })
      .catch(() => {
        setCopySuccess("Failed to copy.");
      });
  };

  // Handle sending data to API
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const payload = {
      prompt: chatInput,
      code: currentCode,
    };

    try {
      const response = await axios.post(`${API_KEY}api/openai`, payload); // Replace with your API endpoint
      console.log(response.data);
      const chat = response.data.data.chat;
      const code = response.data.data.code;

      // Update state with the new chat message and updated code
      setChatMessages((prev) => [
        ...prev,
        { sender: "user", text: chatInput },
        { sender: "ai", text: chat },
      ]);
      setCurrentCode(code);
      setChatInput(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prev) => [
        ...prev,
        { sender: "system", text: "Failed to fetch response. Try again." },
      ]);
    }
  };

  return (
    <div className={`fixed top-0 right-0 w-full h-full z-20 bg-white p-6`}>
      <button onClick={() => setCodeDisplay(false)}>
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          fill="#5c5c5c"
          stroke="#5c5c5c"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              fill="#000000"
              d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
            ></path>
            <path
              fill="#000000"
              d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
            ></path>
          </g>
        </svg>
      </button>

      <div className="flex h-full">
        {/* Chat Section */}
        <div className="w-1/2 bg-gray-100 p-4 flex flex-col">
          <div className="flex-1 overflow-auto mb-2">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-start"
                    : "bg-gray-300 self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>

        {/* Code Display Section */}
        <div className="w-1/2 bg-[#edf9fc] p-4 overflow-auto">
          <div className="flex justify-end items-center">
            <div className="flex gap-2">
              <button
                onClick={onDownloadProject}
                className="p-2 bg-sky-500 hover:bg-blue-600 text-white shadow-md rounded text-sm"
              >
                Download
              </button>
              <button
                onClick={handleCopy}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
              >
                Copy
              </button>
            </div>
          </div>
          <pre className="rounded-lg p-4 mt-2">
            <code ref={codeRef} className="language-python text-xs">
              {currentCode}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeDisplay;
