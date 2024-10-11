import React, { useEffect, useRef, useState } from 'react';
import ButtonImage from '../classes/imageButton';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_KEY } from '../constant';

import idle from "../assets/buttons/sample/idle.png";
import clicked from "../assets/buttons/sample/clicked.png";
import hover from "../assets/buttons/sample/hover.png";

const AddButtonImage = () => {
    const canvasRef = useRef(null);
    const [canvasObj, setCanvasObj] = useState(null);
    const [elementData, setElementData] = useState({
        id: Date.now(),
        x: 100,
        y: 100,
        scale: 1.5,
        idleImage: idle,
        hoverImage: clicked,
        clickedImage: hover,
    });

    // Initialize Fabric canvas
    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;

        const canvas = new fabric.Canvas(canvasEl, {
            width: 500,
            height: 350,
            backgroundColor: '#f3f3f3',
            selection: false,
        });
        setCanvasObj(canvas);

        return () => {
            canvas.dispose();
            setCanvasObj(null);
        };
    }, []);

    // Function to create and add the fabric element
    const addElementToCanvas = async () => {
        if (!canvasObj) return;
        canvasObj.clear(); // Clear canvas before adding new elements

        const fabricElement = await createFabricElement(elementData); // Wait for the promise to resolve
        if (fabricElement) {
            canvasObj.add(fabricElement);
            canvasObj.renderAll(); // Ensure canvas is rendered after adding the element
        }
    };

    useEffect(() => {
        addElementToCanvas();
    }, [canvasObj, elementData]); // Trigger when canvasObj or elementData changes

    const createFabricElement = async (element) => {
        if (!canvasObj) return null;

        const fabricElement = new ButtonImage(
            canvasObj,
            element.x,
            element.y,
            [element.idleImage, element.hoverImage, element.clickedImage],
            element.scale
        );

        return await fabricElement.getFabricElementAsync(); // Ensure the element is added correctly
    };

    // Handle image file uploads and convert them to Base64
    const handleFileChange = async (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setElementData((prev) => ({
                    ...prev,
                    [type]: base64String, // Set base64 image to the respective type
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle input changes for non-image fields like scale
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setElementData((prev) => ({
            ...prev,
            [name]: name === 'scale' ? parseFloat(value) : value, // Ensure scale is a number
        }));
    };

    // Handle submit to send data to API
    const handleSubmit = async () => {
        try {
            console.log(elementData);
            const response = await axios.post(`${API_KEY}api/buttonImages/`, elementData);
            const result = await response.data;
            console.log('Button Image saved:', result);
            Swal.fire({
                title: "Button Image Added Successfully",
                showCancelButton: false,
                confirmButtonText: "ok",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        } catch (error) {
            console.error('Error saving button image:', error);
        }
    };

    return (
        <div className="flex border rounded shadow-sm gap-4 items-center justify-between p-4">
            <div className=' w-[30%] h-[400px] p-4 overflow-auto'>
                <h2 className="text-lg font-bold">Button Images Properties</h2>

                {/* Scale Input */}
                <div className="mb-4">
                    <label className="block">Scale:</label>
                    <input
                        type="range"
                        name="scale"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={elementData.scale}
                        onChange={handleInputChange}
                        className="border p-1 rounded"
                    />
                    <span>{elementData.scale}</span>
                </div>

                {/* Idle Image Input */}
                <div className="mb-4">
                    <label className="block">Idle Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'idleImage')}
                        className="border p-1 rounded"
                    />
                </div>

                {/* Hover Image Input */}
                <div className="mb-4">
                    <label className="block">Hover Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'hoverImage')}
                        className="border p-1 rounded"
                    />
                </div>

                {/* Clicked Image Input */}
                <div className="mb-4">
                    <label className="block">Clicked Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'clickedImage')}
                        className="border p-1 rounded"
                    />
                </div>

                {/* Submit Button */}
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                    Submit
                </button>
            </div>

            {/* Canvas to Display Image */}
            <div>
                <canvas ref={canvasRef} id="canvas" className="border shadow-lg" />
            </div>
        </div>
    );
};

export default AddButtonImage;
