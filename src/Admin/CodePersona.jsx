import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import AssetManagement from "./AssetsManagement";
import FileUploadComponent from "./AddPersona";

function Persona() {
  return (
    <div className="min-h-screen flex flex-col antialiased">
      <Header />
      <Sidebar />
      {/* Main content area */}
      <div className="flex-grow p-4 ml-64 mt-14">
        {" "}
        {/* Adjust margin and padding */}
        <FileUploadComponent />
      </div>
    </div>
  );
}

export default Persona;
