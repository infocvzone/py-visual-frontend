import React, { useEffect, useRef } from 'react';
import PlainButton from '../classes/plainButton'; // Import the class

const ButtonComponent = ({ 
    text = "My Button", 
    idleColor = '#38b6ff', 
    hoverColor = '#7cc8f4', 
    clickedColor = '#155980', 
    textColor = '#FFFFFF', 
    width = 150, 
    height = 50,
    border_thickness = 1,
    borderColor = "#000000"
}) => {
    const buttonContainerRef = useRef(null); // Create a reference to the container
    const buttonInstanceRef = useRef(null); // Create a reference to store the PlainButton instance

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
            buttonInstanceRef.current = new PlainButton(
                container,
                text,          // Button text
                idleColor,     // idleColor
                hoverColor,    // hoverColor
                clickedColor,  // clickedColor
                textColor,     // textColor
                width,         // width
                height,
                border_thickness,
                borderColor
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
}

export default ButtonComponent;
