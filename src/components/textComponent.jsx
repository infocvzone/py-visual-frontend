import React, { useEffect, useRef } from "react";
import PlainText from "../classes/plainText"; // Import the PlainText class

const TextComponent = ({
  text = "Default Text",
  color = "#000000", // Default text color
  scale = 1.0,
  fontSize = 20,
  fontFamily = "Roboto",
  bold = false,
  italic = false,
  underline = false,
  strikethrough = false,
}) => {
  const textContainerRef = useRef(null); // Create a reference to the container
  const textInstanceRef = useRef(null); // Create a reference to store the PlainText instance

  useEffect(() => {
    const container = textContainerRef.current;

    // Clear the previous text element if it exists
    if (textInstanceRef.current && container) {
      container.innerHTML = ""; // Remove any previous text instance
    }

    // Instantiate the PlainText class and attach it to the container
    if (container) {
      textInstanceRef.current = new PlainText(
        container,
        text, // Text content
        color, // Idle color
        scale, // Scale
        fontSize, // Font size
        fontFamily, // Font family
        bold,
        italic,
        underline,
        strikethrough,
      );
    }

    // Cleanup: Remove the text element when the component unmounts
    return () => {
      if (container) {
        container.innerHTML = ""; // Clear the container when unmounting
      }
      textInstanceRef.current = null; // Clean up the instance reference
    };
  }, [text, color, scale, fontSize, fontFamily]);

  return (
    <div ref={textContainerRef}></div> // This div will hold the text element
  );
};

export default TextComponent;
