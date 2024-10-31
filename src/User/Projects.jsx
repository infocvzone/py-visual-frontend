// Projects.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../constant";
import { useSelector } from "react-redux";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Fetch user's projects from the database
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${API_KEY}api/projects/user/${user._id}`
        );
        setProjects(response.data);
      } catch (err) {
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const handleProjectSelect = (project) => {
    navigate("/home", { state: { projectData: project } });
  };

  const handleBlankProject = () => {
    navigate("/home", { state: { projectData: false } });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Select a Project
        </h2>
        {/*error && <p className="text-red-500 text-center mb-4">{error}</p>*/}

        <div className="space-y-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <button
                key={project._id}
                onClick={() => handleProjectSelect(project)}
                className="w-full text-left bg-blue-100 p-4 rounded-lg hover:bg-blue-200 transition"
              >
                {project.name}
              </button>
            ))
          ) : (
            <p className="text-center text-gray-500">No projects found.</p>
          )}
          {/* Blank Project Option */}
          <button
            onClick={handleBlankProject}
            className="w-full text-left bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition"
          >
            + Start a Blank Project
          </button>
        </div>
      </div>
    </div>
  );
}
