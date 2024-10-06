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
    const [selectedTop, setSelectedTop] = useState(null);
    const [selectedBottom, setSelectedBottom] = useState(null);
    const [selectedLayer, setSelectedLayer] = useState(null);

    useEffect(() => {
        
        const fetchTops = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/images/tops');
                setTops(response.data);
            } catch (error) {
                console.error('Error fetching tops:', error);
            }
        };

        
        const fetchBottoms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/images/bottoms');
                setBottoms(response.data);
            } catch (error) {
                console.error('Error fetching bottoms:', error);
            }
        };

        
        const fetchLayers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/images/layers');
                setLayers(response.data);
            } catch (error) {
                console.error('Error fetching layers:', error);
            }
        };

        
        fetchTops();
        fetchBottoms();
        fetchLayers();
    }, []);

    const handleSaveFit = async () => {
        if (!selectedTop || !selectedBottom || !selectedLayer) {
            alert('Please select a top, bottom, and layer.');
            return;
        }

        const fit = {
            top: selectedTop,
            bottom: selectedBottom,
            layer: selectedLayer,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/save-fit', fit);
            console.log('Fit saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving fit:', error);
            alert('Failed to save fit.');
        }
    };

  

  return (
    <>
      <Navbar />
      <div className='container'>
        <ClothSelector images={layers} onSelect={setSelectedLayer}/>
        <ClothSelector images={tops} onSelect={setSelectedTop}/>
        <ClothSelector images={bottoms} onSelect={setSelectedBottom}/>
        <button className="save-fits-button" onClick={handleSaveFit}>Save Fit</button>
      </div>
    </>
  );
}

export default App
