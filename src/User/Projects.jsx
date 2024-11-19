// Projects.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../constant";
import { useSelector } from "react-redux";
import { FaTrashAlt } from "react-icons/fa"; // Import delete icon
import Swal from "sweetalert2";

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

  const deleteProject = async (projectId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_KEY}api/projects/${projectId}`);
          Swal.fire({
            title: `Project deleted!`,
            showCancelButton: false,
            confirmButtonText: "ok",
          }).then(() => {
            window.location.reload(); // Refresh page on success
          });
        } catch (err) {
          alert("Failed to delete the project. Please try again later.");
        }
      }
    });
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
              <div key={project._id} className="relative">
                <button
                  onClick={() => handleProjectSelect(project)}
                  className="w-full text-left bg-blue-100 p-4 rounded-lg hover:bg-blue-200 transition relative z-10"
                >
                  {project.name}
                </button>
                <FaTrashAlt
                  onClick={() => deleteProject(project._id)}
                  className="absolute top-1/2 transform -translate-y-1/2 right-4 text-red-500 cursor-pointer z-20 hover:text-red-700"
                  title="Delete Project"
                />
              </div>
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
