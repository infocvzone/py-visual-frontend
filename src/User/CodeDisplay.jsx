import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js"; // Import highlight.js
import "highlight.js/styles/atom-one-dark.css";

const CodeDisplay = ({ code, setCodeDisplay }) => {
  const [copySuccess, setCopySuccess] = useState(""); // State to show copy success message
  const codeRef = useRef(null); // Ref to the <pre><code> block

  // Use effect to highlight code after the component renders or when code changes
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code]);

  // Function to handle copying the code to the clipboard
  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopySuccess("Code copied!");
        setTimeout(() => {
          setCopySuccess("");
          setCodeDisplay(false);
        }, 700); // Reset the message after 2 seconds
      })
      .catch(() => {
        setCopySuccess("Failed to copy.");
      });
  };

  return (
    <div className="fixed top-16 right-2 w-[70%] lg:w-[60%] p-4 bg-white shadow-lg border rounded-lg overflow-hidden my-4">
      <button onClick={()=> setCodeDisplay(false)}>
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24.00 24.00"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#22c55e"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
              stroke=""
              strokeWidth="2.4"
              strokeLinecap="round"
            ></path>{" "}
            <path
              d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
              stroke=""
              strokeWidth="2.4"
              strokeLinecap="round"
            ></path>{" "}
          </g>
        </svg>
      </button>

      {copySuccess && (
        <div className="text-green-400 text-sm mb-2">{copySuccess}</div>
      )}

      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm flex items-center justify-center gap-1"
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#FFF"
        >
          <path
            d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
            stroke="#fff"
            strokeWidth="1.5"
          ></path>
          <path
            d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
            stroke="#fff"
            strokeWidth="1.5"
          ></path>
        </svg>
        Copy
      </button>

      {/* Scrollable preformatted block for displaying the code */}
      <div className="max-h-[450px] overflow-auto mt-2 rounded-lg bg-[#edf9fc] p-4">
        <pre>
          <code ref={codeRef} className="language-python text-xs">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;
