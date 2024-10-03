import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import ClothSelector from './ClothSelector/ClothSelector.jsx';
import AddFits from './AddFits.jsx'; // Import your AddFits component
import axios from 'axios';

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
      <div className="navbar">
        <h1>Fit Finder</h1>
        <ul>
          <Link to="/add-fits" className='routeLink'>
          <li>Add Fits</li>
          </Link>
          <li>Sign in</li>
        </ul>
      </div>
      <div className='container'>
        <ClothSelector />
        <ClothSelector />
        <ClothSelector />
      </div>
    </>
  );
}

export default App
