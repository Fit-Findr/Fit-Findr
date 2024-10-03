import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import ClothSelector from './ClothSelector/ClothSelector.jsx';
import AddFits from './AddFits.jsx'; // Import your AddFits component
import axios from 'axios';
import Navbar from './Navbar/Navbar.jsx';
function App() {

    const [tops, setTops] = useState([]);
    const [bottoms, setBottoms] = useState([]);
    const [layers, setLayers] = useState([]);

    useEffect(() => {
        // Fetch tops
        const fetchTops = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/images/tops');
                setTops(response.data);
            } catch (error) {
                console.error('Error fetching tops:', error);
            }
        };

        // Fetch bottoms
        const fetchBottoms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/images/bottoms');
                setBottoms(response.data);
            } catch (error) {
                console.error('Error fetching bottoms:', error);
            }
        };

        // Fetch layers
        const fetchLayers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/images/layers');
                setLayers(response.data);
            } catch (error) {
                console.error('Error fetching layers:', error);
            }
        };

        // Call fetch functions
        fetchTops();
        fetchBottoms();
        fetchLayers();
    }, []);

  

  return (
    <>
      <Navbar />
      <div className='container'>
        <ClothSelector images={layers}/>
        <ClothSelector images={tops}/>
        <ClothSelector images={bottoms}/>
      </div>
    </>
  );
}

export default App
