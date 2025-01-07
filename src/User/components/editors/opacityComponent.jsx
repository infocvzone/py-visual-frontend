import React, { useState } from "react";
import opacitySvg from "../../../assets/opacity.svg";

const SvgButtonWithRange = ({ Name, value, onChange }) => {
  const [showSlider, setShowSlider] = useState(false);

  // Handle the button click to toggle the visibility of the slider
  const handleButtonClick = () => {
    setShowSlider((prev) => !prev);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Button with SVG */}
      <button
        onClick={handleButtonClick}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Example SVG icon */}
        <img src={opacitySvg} alt="opacity" />
      </button>

      {/* Slider (Range Input) */}
      {showSlider && (
        <div
          style={{
            position: "absolute",
            top: "45px", // Position it below the button
            left: -10,
            width: "120px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow effect
            padding: "10px", // Add padding around the slider
            zIndex: 100,
          }}
        >
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.01"
            name={Name}
            value={value} // Use the value prop directly here
            onChange={(e) => {
              onChange({
                target: { name: `${Name}`, value: e.target.value },
              });
            }}
            style={{
              width: "100%", // Make slider full width of its container
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SvgButtonWithRange;
