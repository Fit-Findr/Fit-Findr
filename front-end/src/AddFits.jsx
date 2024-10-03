import Navbar from "./Navbar/Navbar.jsx";
import React, { useState } from 'react';
import axios from 'axios'; // To make HTTP requests

function AddFits() {
  const [selectedFile, setSelectedFile] = useState(null); // Holds the selected file
  const [imagePreview, setImagePreview] = useState(null); // Holds the image preview
  const [category, setCategory] = useState(''); // Holds the selected category


  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file selected
    setSelectedFile(file); // Store selected file

    // Generate a preview URL for the selected image
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value); // Set the selected category
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    if (!category) {
      alert("Please select a category!");
      return;
    }

    // Create FormData to send the file to the backend
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('category', category); 

    try {
      // Send the FormData to the backend
      const response = await axios.post('http://localhost:8080/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, 
      });
      console.log("File and category uploaded successfully:", response.data);
      setSelectedFile(null);
      setImagePreview(null);
      setCategory('');
    } catch (error) {
      console.error("Error uploading file and category:", error);
    }
  };


    return (
      <div>
      <Navbar />
      <div className="container">
      <div className="form-container">
        <h2>Upload an Image</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} /> 

          
          <select value={category} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="layer">Layer</option>
          </select>

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
    </div>
    );
}


export default AddFits;