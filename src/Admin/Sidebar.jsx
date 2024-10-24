import React from 'react';

const Sidebar = () => {
    return (
        <div className="fixed flex flex-col top-14 left-0 w-14 hover:w-64 md:w-64 bg-blue-900 h-full text-white transition-all duration-300 border-none sidebar">
            <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
                <ul className="flex flex-col py-4 space-y-1">
                    <li className="px-5 hidden md:block">
                        <div className="flex flex-row items-center h-8">
                            <div className="text-sm font-light tracking-wide text-gray-400 uppercase">PY - VISUAL</div>
                        </div>
                    </li>
                    <li>
                        <a href="/admin" className="relative flex flex-row items-center h-11 hover:bg-blue-800 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="/element-types" className="relative flex flex-row items-center h-11 hover:bg-blue-800 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">Types</span>
                        </a>
                    </li>
                    <li>
                        <a href="/add-element" className="relative flex flex-row items-center h-11 hover:bg-blue-800 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">Add Elements</span>
                        </a>
                    </li>
                    <li>
                        <a href="/assets" className="relative flex flex-row items-center h-11 hover:bg-blue-800 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">Assets</span>
                        </a>
                    </li>
                    {/* Add more items */}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
