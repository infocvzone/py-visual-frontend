import React, { useState } from "react";
import AddButton from "./AddButton";
import AddText from "./AddText";
import AddButtonImage from "./AddImageButton";
import ImageUploader from "./AddBgImages";
import AddInputField from "./AddInputField";
import AddLine from "./Addline";
import AddCircle from "./AddCircle";
import AddRect from "./AddRectangle";
import ImagesUploader from "./AddImages";

const AddElement = () => {
  const [selectedElement, setSelectedElement] = useState("");

  return (
    <div className="p-6 border rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Choose an Element to Add</h1>

      {/* Radio buttons to choose between adding Button or Text */}
      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="button"
            checked={selectedElement === "button"}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="mr-2"
          />
          Basic Button
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="text"
            checked={selectedElement === "text"}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="mr-2"
          />
          Text
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="buttonImage"
            checked={selectedElement === "buttonImage"}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="mr-2"
          />
          Custom Button
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="InputField"
            checked={selectedElement === "InputField"}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="mr-2"
          />
          Basic InputField
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="bgImage"
            checked={selectedElement === "bgImage"}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="mr-2"
          />
          Background Images
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="Images"
            checked={selectedElement === "Images"}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="mr-2"
          />
          Images
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="Line"
            checked={selectedElement === "Line"}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="mr-2"
          />
          Line
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="Circle"
            checked={selectedElement === "Circle"}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="mr-2"
          />
          Circle
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="Rect"
            checked={selectedElement === "Rect"}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="mr-2"
          />
          Rectangle
        </label>
      </div>

      {/* Conditionally render the selected component */}
      {selectedElement === "button" && <AddButton />}
      {selectedElement === "text" && <AddText />}
      {selectedElement === "buttonImage" && <AddButtonImage />}
      {selectedElement === "bgImage" && <ImageUploader />}
      {selectedElement === "InputField" && <AddInputField />}
      {selectedElement === "Line" && <AddLine />}
      {selectedElement === "Circle" && <AddCircle />}
      {selectedElement === "Rect" && <AddRect />}
      {selectedElement === "Images" && <ImagesUploader/>}
    </div>
  );
};

export default AddElement;
