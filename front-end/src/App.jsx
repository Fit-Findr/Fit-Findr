import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import ClothSelector from './ClothSelector/ClothSelector.jsx';
import AddFits from './AddFits.jsx'; // Import your AddFits component
import axios from 'axios';
import Navbar from './Navbar/Navbar.jsx';
function App() {

  // const fetchAPI = async () => {
  //   const response = await axios.get('http://localhost:8080/api/users');
  //   console.log(response.data.users);
  // };

  // useEffect(() => {
  //   fetchAPI();
  // }, []);
  

  return (
    <>
      <Navbar />
      <div className='container'>
        <ClothSelector />
        <ClothSelector />
        <ClothSelector />
      </div>
    </>
  );
}

export default App
