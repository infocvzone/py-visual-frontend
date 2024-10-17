// components/InputComponent.js
import React, { useEffect, useRef } from "react";
import PlainInput from "../classes/PlainInputField"; // Import the PlainInput class

const InputComponent = ({
  width = 300,
  height = 40,
  placeholder = "Enter text...",
  bgColor = "#ffffff",
  borderColor = "#c8c8c8",
  borderThickness = 1,
  textColor = "#323232",
  placeholderColor = "#c8c8c8",
  fontSize = 15,
  padding = 10,
  fontFamily = "Roboto-Bold",
  inputType = "text",
  defaultValue = "",
  paddingLeft = 10,
  paddingRight = 10,
  paddingTop = 0,
  paddingBottom = 10,
  borderStyle = ["bottom", "top", "right", "left"],
  onInput = null,
}) => {
  const inputContainerRef = useRef(null); // Reference to the container
  const inputInstanceRef = useRef(null); // Reference to store the PlainInput instance

  useEffect(() => {
    // Load custom font (if needed)
    WebFont.load({
      google: {
        families: [fontFamily],
      },
    });

    const container = inputContainerRef.current;

    // Clear the previous input instance if it exists
    if (inputInstanceRef.current && container) {
      container.innerHTML = "";
    }

    // Create the input field using PlainInput class
    if (container) {
      inputInstanceRef.current = new PlainInput(container, {
        width,
        height,
        placeholder,
        bgColor,
        borderColor,
        borderThickness,
        textColor,
        placeholderColor,
        fontSize,
        padding,
        fontFamily,
        inputType,
        defaultValue,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        borderStyle,
        onInput,
      });
    }

    // Cleanup when component unmounts
    return () => {
      if (container) {
        container.innerHTML = "";
      }
      inputInstanceRef.current = null;
    };
  }, [
    width,
    height,
    placeholder,
    bgColor,
    borderColor,
    borderThickness,
    textColor,
    placeholderColor,
    fontSize,
    padding,
    fontFamily,
    inputType,
    defaultValue,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    borderStyle,
    onInput,
  ]);

  return <div ref={inputContainerRef}></div>;
};

export default InputComponent;
