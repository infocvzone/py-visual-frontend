// src/FileUploadComponent.js
import React, { useState, useEffect } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth";
import axios from "axios";
import { API_KEY } from "../constant";

// Set up the worker script for PDF.js
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const FileUploadComponent = () => {
  const [fileContent, setFileContent] = useState(""); // State to hold the extracted or typed text
  const [error, setError] = useState(""); // State to hold any error messages
  const [paragraph, setParagraph] = useState(""); // State to hold the fetched paragraph
  const [showParagraph, setShowParagraph] = useState(false); // State to toggle paragraph display

  // Fetch paragraph data when the component renders
  useEffect(() => {
    const fetchParagraph = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/persona`); // Adjust API endpoint as needed
        console.log(response);
        setFileContent(response.data[0].persona);
      } catch (err) {
        console.error("Error fetching paragraph:", err);
        setError("Error fetching paragraph. Check console for details.");
      }
    };

    fetchParagraph();
  }, []);

  // Handle file upload and processing
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase(); // Extract the file extension
      setError(""); // Clear any previous errors

      try {
        // Check file extension and call appropriate extraction function
        if (fileExtension === "pdf") {
          await extractPdfText(file); // Extract text from PDF
        } else if (fileExtension === "docx") {
          await extractDocxText(file); // Extract text from DOCX
        } else {
          setError("Unsupported file type! Please upload a PDF or DOCX file."); // Set error message
        }
      } catch (err) {
        console.error("Error processing file:", err); // Log any errors during file processing
        setError("Error processing file. Check console for details."); // Set error message for user
      }
    }
  };

  // Extract text from a PDF file
  const extractPdfText = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer(); // Read file as an ArrayBuffer
      const pdf = await getDocument(arrayBuffer).promise; // Load the PDF document
      let text = ""; // Initialize a string to hold the extracted text

      // Loop through all pages of the PDF
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i); // Get the page
        const content = await page.getTextContent(); // Extract text content from the page
        const pageText = content.items.map((item) => item.str).join(" "); // Concatenate text items
        text += pageText + "\n"; // Add page text to the overall text
      }

      setFileContent(text); // Update state with the extracted text
    } catch (err) {
      console.error("Error extracting PDF text:", err); // Log errors during PDF extraction
      setError("Error extracting PDF text. Check console for details."); // Set error message for user
    }
  };

  // Extract text from a DOCX file
  const extractDocxText = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer(); // Read file as an ArrayBuffer
      const { value: text } = await mammoth.extractRawText({ arrayBuffer }); // Extract raw text using Mammoth
      setFileContent(text); // Update state with the extracted text
    } catch (err) {
      console.error("Error extracting DOCX text:", err); // Log errors during DOCX extraction
      setError("Error extracting DOCX text. Check console for details."); // Set error message for user
    }
  };

  // Handle text input in the text area
  const handleTextChange = (event) => {
    setFileContent(event.target.value); // Update state with the text area content
  };

  // Handle submit button click
  const handleSubmit = async () => {
    try {
      await axios.post(`${API_KEY}api/persona`, {
        persona: fileContent,
      }); // Adjust API endpoint as needed
      alert("Content submitted successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error submitting content:", err);
      setError("Error submitting content. Check console for details.");
    }
  };

  // Toggle paragraph display
  const toggleParagraphDisplay = () => {
    setShowParagraph(!showParagraph);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* File input for uploading PDF or DOCX files */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Upload a file (PDF or DOCX):
        </label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>

      {/* Text area for manual text input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Or type your text here:
        </label>
        <textarea
          value={fileContent}
          onChange={handleTextChange}
          placeholder="Type or upload text..."
          rows="10"
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Submit button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FileUploadComponent;
