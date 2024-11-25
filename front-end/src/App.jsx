import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import ClothSelector from './ClothSelector/ClothSelector.jsx';
import AddFits from './AddFits.jsx';
import axios from 'axios';
import Navbar from './NavBar/NavBar.jsx';
function App() {

    const [tops, setTops] = useState([]);
    const [bottoms, setBottoms] = useState([]);
    const [layers, setLayers] = useState([]);
    const [selectedTop, setSelectedTop] = useState(null);
    const [selectedBottom, setSelectedBottom] = useState(null);
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [temp, setTemp] = useState(null);
    const [loadingTemp, setLoadingTemp] = useState(true);

    const getTemperatureAtPoint = async (lat, lon) => { 
        // Get data about lat lon point       
        const point_url = "https://api.weather.gov/points/" + lat + "," + lon;
        const response = await fetch(point_url);
        if (!response.ok) {
            console.log("Error fetching point data");
            return;
        }

        // Get url for forecast at point
        const point_json = await response.json();
        const forecast_url = point_json["properties"]["forecast"];

        // Fetch forecast data using url
        const forecast_response = await fetch(forecast_url);
        if (!forecast_response.ok) {
            console.log("Error fetching forecast data");
            return;
        }

        // Get temperature from the next available forecast period
        const forecast_json = await forecast_response.json();
        const forecast_periods = forecast_json["properties"]["periods"];
        if (forecast_periods.length == 0) {
            console.log("No available forecasts");
            return;
        }
        const first_forecast_period = forecast_periods[0];
        const temperature = first_forecast_period["temperature"];
        setLoadingTemp(false);
        setTemp(temperature);
    }

    const getWeatherForLocation = async () => {
        // Get lat lon and fetch temp at that location
        navigator.geolocation.getCurrentPosition((position) => {
            getTemperatureAtPoint(position.coords.latitude, position.coords.longitude);
          });
    }

    useEffect(() => {
        
        const fetchTops = async () => {
            try {
                const response = await axios.get('https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/api/images/tops');
                setTops([null,...response.data]);
            } catch (error) {
                console.error('Error fetching tops:', error);
            }
        };

        
        const fetchBottoms = async () => {
            try {
                const response = await axios.get('https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/api/images/bottoms');
                setBottoms([null,...response.data]);
            } catch (error) {
                console.error('Error fetching bottoms:', error);
            }
        };

        
        const fetchLayers = async () => {
            try {
                const response = await axios.get('https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/api/images/layers');
                setLayers([null,...response.data]);
            } catch (error) {
                console.error('Error fetching layers:', error);
            }
        };

        
        fetchTops();
        fetchBottoms();
        fetchLayers();
        getWeatherForLocation();
    }, []);

    const handleSaveFit = async () => {
        

        const fit = {
            top: selectedTop || null,
            bottom: selectedBottom || null,
            layer: selectedLayer || null,
        };

        try {
            const response = await axios.post('https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/api/save-fit', fit);
            console.log('Fit saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving fit:', error);
            alert('Failed to save fit.');
        }
    };

  

  return (
    <>
      <Navbar />
        <div className='temperature'>
            {loadingTemp ? (
                <p>Loading temperature...</p>
            ) : (
                <p>High Today: {temp}°F</p>
            )}
        </div>
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
