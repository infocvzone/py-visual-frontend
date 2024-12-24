import React, { useEffect, useRef } from "react";
import PlainButton from "../classes/plainButton"; // Import the class

const ButtonComponent = ({
  text = "My Button",
  idleColor = "#38b6ff",
  hoverColor = "#7cc8f4",
  clickedColor = "#155980",
  textColor = "#FFFFFF",
  width = 150,
  height = 50,
  border_thickness = 1,
  borderColor = "#000000",
  fontFamily = "Roboto",
}) => {
  const buttonContainerRef = useRef(null); // Create a reference to the container
  const buttonInstanceRef = useRef(null); // Create a reference to store the PlainButton instance

  useEffect(() => {
    WebFont.load({
      google: {
        families: [fontFamily],
      },
    });
  }, [fontFamily]);

  // Parse color string (hex, rgb, rgba) and return an object with r, g, b, a values
  const parseColor = (color) => {
    let r,
      g,
      b,
      a = 1;

    if (color.startsWith("#")) {
      // Hex color code (e.g., #ff0000 or #ff0000ff)
      const hex = color.slice(1);
      if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else if (hex.length === 8) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
        a = parseInt(hex.slice(6, 8), 16) / 255;
      }
    } else if (color.startsWith("rgb")) {
      // RGB or RGBA color (e.g., rgb(255, 0, 0) or rgba(255, 0, 0, 0.5))
      const rgba = color.match(/(\d+), (\d+), (\d+),? ?(\d*\.?\d*)/);
      if (rgba) {
        r = parseInt(rgba[1]);
        g = parseInt(rgba[2]);
        b = parseInt(rgba[3]);
        a = rgba[4] ? parseFloat(rgba[4]) : 1;
      }
    }

    return { r, g, b, a };
  };

  useEffect(() => {
    const container = buttonContainerRef.current;

    // Clear the previous button if it exists
    if (buttonInstanceRef.current && container) {
      // Assuming PlainButton creates a DOM element in the container,
      // clear the container's innerHTML to remove previous button instances
      container.innerHTML = "";
    }

    // Instantiate the PlainButton class and attach it to the container
    if (container) {
      const { r, g, b, a } = parseColor(idleColor);
      let hoverColor = `rgba(${r}, ${g}, ${b}, ${a * 0.75})`; // Hover color with 75% opacity
      let clickedColor = `rgba(${r}, ${g}, ${b}, ${a * 0.50})`;
      
      buttonInstanceRef.current = new PlainButton(
        container,
        text, // Button text
        idleColor, // idleColor
        hoverColor, // hoverColor
        clickedColor, // clickedColor
        textColor, // textColor
        width, // width
        height,
        border_thickness,
        borderColor,
        fontFamily
      );
    }

    // Cleanup: Remove button when the component unmounts
    return () => {
      if (container) {
        container.innerHTML = ""; // Clear the container when unmounting
      }
      buttonInstanceRef.current = null;
    };
  }, [text, idleColor, hoverColor, clickedColor, textColor, width, height]);

  return (
    <div ref={buttonContainerRef}></div> // This div will hold the button
  );
};

export default ButtonComponent;
