import React, { useEffect, useState } from "react";
import logo from "../assets/cv-zone.svg";
import code from "../assets/download.png";
import save from "../assets/save.png";
import DownloadSvg from "../assets/download.svg";

function Header({ onGenerateCode, onSaveProject, ProjectName }) {
  const [projectName, setProjectName] = useState(ProjectName);

  useEffect(() => {
    setProjectName(ProjectName);
  }, [ProjectName]); // Syncs with parent state when it changes

  const handleSaveProject = () => {
    onSaveProject(projectName);
  };

  return (
    <div className="flex items-center justify-between h-[55px] bg-gradient-to-r from-[#5de0e6] to-[#004aad] shadow-lg">
      <div className="w-1/5 h-full flex items-center justify-center gap-4 pr-8">
        <img src={logo} alt="Zui" className="h-[12px]" />
        <button className="w-[40px] h-[25px] border border-white text-white text-xs bg-transparent hover:shadow-lg rounded">
          file
        </button>
      </div>

      <div className="flex items-center justify-end px-6 w-[85%] h-full">
        {/* Project Name Input */}
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-[150px] bg-transparent border-b-2 text-sm border-gray-200 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-sky-300"
        />
        {/* Save Project Button */}
        <button
          className="p-[5px] ml-2 border border-gray-300 text-white text-sm rounded-md shadow-lg transition"
          onClick={handleSaveProject}
        >
          <img src={save} alt="save" className="w-[18px]" />
        </button>
        <button
          className="px-4 py-[5px] flex mx-2 gap-2 items-center justify-center bg-white text-gray-600 text-sm shadow-xl rounded-lg hover:bg-gray-200 transition"
          onClick={onGenerateCode}
        >
          <img src={code} alt="code" className="w-[15px]" />
          Code
        </button>
      </div>
    </div>
  );
}

export default Header;
