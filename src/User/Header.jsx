import React, { useState } from 'react';
import logo from '../assets/logo.png';
import code from '../assets/codeschool.svg';
import DownloadSvg from "../assets/download.svg";


function Header({ onGenerateCode, onDownloadProject, onWindowSizeChange }) {
    const [width, setWidth] = useState(700);
    const [height, setHeight] = useState(400);

    const handleWindowSizeChange = () => {
        if (width > 800) {
            setWidth(800);
            let temp = 800;
            onWindowSizeChange(temp, height); // Calls the passed function with current width and height
        } else {
            onWindowSizeChange(width, height); // Calls the passed function with current width and height
        }
    };

    return (
        <>
            <div className="flex items-center justify-between h-[70px] bg-gradient-to-l from-[#01A4C9] via-[#08B9E2ED] to-[#0FD1FF]">
                <div className='w-1/4 h-full flex items-center justify-center'>
                    <img src={logo} alt="Zui" className='h-[30px]' />
                </div>

                <div className='flex items-center justify-end px-6 w-1/2 h-full'>
                    <button
                        className="px-2 py-2 flex mx-2 gap-1 items-center justify-center bg-white text-black text-sm shadow-xl rounded-lg hover:bg-gray-200 transition"
                        onClick={onGenerateCode}
                    >
                        Generate Code
                        <img src={code} alt="code"/>
                    </button>

                    {/* New Download Project Button */}
                    <button
                        className="px-2 py-2 flex mx-2 gap-1 items-center justify-center bg-white text-black text-sm shadow-xl rounded-lg hover:bg-gray-200 transition"
                        onClick={onDownloadProject}
                    >
                        Download
                        <img src={DownloadSvg} alt="code"/>
                    </button>

                    <div className="flex gap-2 items-center">
                        <label className="block text-xs font-medium text-white">Width</label>
                        <input
                            type="text"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="w-[40px] h-[30px] text-xs p-2 border border-black rounded"
                        />
                    </div>
                    <div className="flex gap-2 mx-2 items-center">
                        <label className="block text-xs font-medium text-white">Height</label>
                        <input
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-[40px] h-[30px] text-xs p-2 border border-black rounded"
                        />
                    </div>
                    <button
                        className="w-[40px] h-[30px] text-xs bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-md"
                        onClick={handleWindowSizeChange}
                    >
                        Set
                    </button>
                </div>
            </div>
        </>
    );
}

export default Header;
