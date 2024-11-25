import Navbar from "./NavBar/NavBar.jsx";
import React, { useState } from 'react';
import axios from 'axios'; // To make HTTP requests

function AddFits() {
  const [selectedFile, setSelectedFile] = useState(null); // Holds the selected file
  const [imagePreview, setImagePreview] = useState(null); // Holds the image preview
  const [category, setCategory] = useState(''); // Holds the selected category
  const [subcategory, setSubcategory] = useState(''); // Holds the selected subcategory

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file selected
    setSelectedFile(file); // Store selected file

    // Generate a preview URL for the selected image
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle category change and reset subcategory
  const handleCategoryChange = (event) => {
    setCategory(event.target.value); // Set the selected category
    setSubcategory(''); // Reset the subcategory when the main category changes
  };

  // Handle subcategory change
  const handleSubcategoryChange = (event) => {
    setSubcategory(event.target.value);
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
    if (!subcategory) {
      alert("Please select a subcategory!");
      return;
    }

    // Create FormData to send the file to the backend
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('category', category);
    formData.append('subcategory', subcategory); // Add the subcategory

    try {
      // Send the FormData to the backend
      const response = await axios.post('https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, 
      });
      console.log("File, category, and subcategory uploaded successfully:", response.data);
      setSelectedFile(null);
      setImagePreview(null);
      setCategory('');
      setSubcategory('');
    } catch (error) {
      console.error("Error uploading file, category, and subcategory:", error);
    }
  };

  // Define subcategory options based on selected category
  const subcategoryOptions = () => {
    switch (category) {
      case 'top':
        return (
          <>
            <option value="">Select Subcategory</option>
            <option value="t-shirt">T-shirt</option>
            <option value="long-sleeve">Long Sleeve</option>
            <option value="tank-top">Tank Top</option>
          </>
        );
      case 'bottom':
        return (
          <>
            <option value="">Select Subcategory</option>
            <option value="shorts">Shorts</option>
            <option value="long-pants">Long Pants</option>
            <option value="sweatpants">Sweatpants</option>
          </>
        );
      case 'layer':
        return (
          <>
            <option value="">Select Subcategory</option>
            <option value="jacket">Jacket</option>
            <option value="sweatshirt">Sweatshirt</option>
            <option value="flannel">Flannel</option>
          </>
        );
      default:
        return <option value="">Select a Category First</option>;
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

            {/* Main Category Dropdown */}
            <select value={category} onChange={handleCategoryChange}>
              <option value="">Select Category</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="layer">Layer</option>
            </select>

            {/* Subcategory Dropdown */}
            {category && (
              <select value={subcategory} onChange={handleSubcategoryChange}>
                {subcategoryOptions()}
              </select>
            )}

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
