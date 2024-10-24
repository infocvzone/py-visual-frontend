import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import AssetManagement from "./AssetsManagement";

function Assets() {
  return (
    <div className="min-h-screen flex flex-col antialiased">
      <Header />
      <Sidebar />
      {/* Main content area */}
      <div className="flex-grow p-4 ml-64 mt-14">
        {" "}
        {/* Adjust margin and padding */}
        <AssetManagement />
      </div>
    </div>
  );
}

export default Assets;
