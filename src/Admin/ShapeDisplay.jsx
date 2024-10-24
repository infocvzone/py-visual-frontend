import React from 'react';

const ShapeDisplay = () => {
  return (
    <div>
      {/* Rectangle inside a div */}
      <div style={{ border: '1px solid #000', width: '100px', height: '50px', marginBottom: '10px' }}></div>

      {/* SVG for displaying shapes */}
      <svg width="200" height="100">
        {/* Rectangle */}
        <rect x="10" y="10" width="100" height="50" fill="blue" />
        
        {/* Circle */}
        <circle cx="150" cy="30" r="20" fill="green" />
        
        {/* Line */}
        <line x1="0" y1="80" x2="200" y2="80" stroke="red" strokeWidth="2" />
      </svg>
      
      {/* Displaying a circle as a button background */}
      <button style={{
        backgroundColor: 'green',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        border: 'none',
        cursor: 'pointer'
      }}>
        Circle Button
      </button>
    </div>
  );
};

export default ShapeDisplay;
