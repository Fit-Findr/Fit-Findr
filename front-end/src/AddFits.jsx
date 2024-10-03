import Navbar from "./Navbar/Navbar.jsx";
import React, { useState } from 'react';
import axios from 'axios'; // To make HTTP requests

function AddFits() {
  const [selectedFile, setSelectedFile] = useState(null); // Holds the selected file
  const [imagePreview, setImagePreview] = useState(null); // Holds the image preview

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file selected
    setSelectedFile(file); // Store selected file

    // Generate a preview URL for the selected image
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    // Create FormData to send the file to the backend
    const formData = new FormData();
    formData.append('image', selectedFile); // Append the file

    try {
      // Send the FormData to the backend
      const response = await axios.post('http://localhost:8080/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Required for file uploads
      });
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };


    return (
        <div>
            <Navbar />
            <div>
      <h2>Upload an Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload Image</button> 
      </form>

      
      {imagePreview && (
        <div>
          <h3>Image Preview:</h3>
          <img src={imagePreview} alt="Selected file" style={{ width: '150px', margin: '10px' }} />
        </div>
      )}
    </div>
        </div>
    );
}


export default AddFits;