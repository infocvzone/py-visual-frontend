import React, { useState } from "react";
import { SketchPicker } from "react-color";
import closeSvg from "../assets/close.svg";

function ColorComponent({ Name, elementColor, Function }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Button with dynamic background color using inline styles */}
      <button
        onClick={() => setOpen(!open)} // Toggle open state
        className="rounded-full text-xs p-[13px] border-2"
        style={{ backgroundColor: elementColor }}
      ></button>

      {/* Color picker only visible when 'open' is true */}
      {open && (
        <>
          {" "}
          <button
            onClick={() => {
              setOpen(!open);
            }}
            className="absolute z-20 top-8 left-0 p-0"
          >
            <img src={closeSvg} alt="close" className="w-[17px]" />
          </button>
          <SketchPicker
            className="absolute z-10"
            color={elementColor || "#000000"}
            onChange={(color) => {
              Function({
                target: { name: `${Name}`, value: color.rgb },
              });
            }}
          />
        </>
      )}
    </div>
  );
}

export default ColorComponent;
