import React, { useState } from 'react';
import AddButton from './AddButton';
import AddText from './AddText';
import AddButtonImage from './AddImageButton';

const AddElement = () => {
    const [selectedElement, setSelectedElement] = useState('');

    return (
        <div className="p-6 border rounded shadow-md">
            <h1 className="text-xl font-bold mb-4">Choose an Element to Add</h1>

            {/* Radio buttons to choose between adding Button or Text */}
            <div className="mb-4">
                <label className="mr-4">
                    <input
                        type="radio"
                        value="button"
                        checked={selectedElement === 'button'}
                        onChange={(e) => setSelectedElement(e.target.value)}
                        className="mr-2"
                    />
                    Add Button
                </label>
                <label className='mr-4'>
                    <input
                        type="radio"
                        value="text"
                        checked={selectedElement === 'text'}
                        onChange={(e) => setSelectedElement(e.target.value)}
                        className="mr-2"
                    />
                    Add Text
                </label>
                <label>
                    <input
                        type="radio"
                        value="buttonImage"
                        checked={selectedElement === 'buttonImage'}
                        onChange={(e) => setSelectedElement(e.target.value)}
                        className="mr-2"
                    />
                    Add Image Button
                </label>
            </div>

            {/* Conditionally render the selected component */}
            {selectedElement === 'button' && <AddButton />}
            {selectedElement === 'text' && <AddText />}
            {selectedElement === 'buttonImage' && <AddButtonImage />}
        </div>
    );
};

export default AddElement;
