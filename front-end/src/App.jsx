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
    const [temp, setTemp] = useState([]);

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

        // Fetch weather data
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
            setTemp(temperature);
        }

        const getWeatherForLocation = async () => {
            // Get lat lon and fetch temp at that location
            navigator.geolocation.getCurrentPosition((position) => {
                getTemperatureAtPoint(position.coords.latitude, position.coords.longitude);
              });
        }


        getWeatherForLocation();        

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
