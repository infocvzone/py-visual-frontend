import React from "react";
import { useNavigate } from "react-router-dom";
import { Adminlogout } from "../Redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(Adminlogout());
    navigate("/admin-login");
  };

  return (
    <div className="fixed w-full flex items-center justify-between h-14 z-10 bg-blue-800 text-white">
      <div className="flex items-center justify-start md:justify-center pl-3 w-14 md:w-64 h-14  border-none">
        {/* <img
                    className="w-18 h-8 md:h-10 mr-2 overflow-hidden"
                    src="https://usercontent.one/wp/www.computervision.zone/wp-content/uploads/2021/04/Untitled-design-92.png"
                    alt="Admin"
                />*/}
        <span className="hidden md:block">{user && user.username}</span>
      </div>
      <div className="flex justify-between items-center h-14 header-right">
        <div className="bg-white rounded flex items-center w-full max-w-xl mr-4 p-2 shadow-sm border border-gray-200">
          <button className="outline-none focus:outline-none">
            <svg
              className="w-5 text-gray-600 h-5 cursor-pointer"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          <input
            type="search"
            placeholder="Search"
            className="w-full pl-3 text-sm text-black outline-none focus:outline-none bg-transparent"
          />
        </div>
        <ul className="flex items-center">
          <li onClick={handleLogout}>
            <a href="/" className="flex items-center mr-4 hover:text-blue-100">
              <span onClick={handleLogout} className="inline-flex mr-1">
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
