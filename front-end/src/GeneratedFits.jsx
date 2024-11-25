import ClothSelector from "./ClothSelector/ClothSelector.jsx";
import Navbar from "./NavBar/NavBar.jsx";
import { useState, useEffect } from 'react';
import axios from 'axios';

function GeneratedFits() {

    const [tops, setTops] = useState([]);
    const [bottoms, setBottoms] = useState([]);
    const [layers, setLayers] = useState([]);
    const [filteredTops, setFilteredTops] = useState([]);
    const [filteredBottoms, setFilteredBottoms] = useState([]);
    const [filteredLayers, setFilteredLayers] = useState([]);
    const [selectedTop, setSelectedTop] = useState();
    const [selectedBottom, setSelectedBottom] = useState();
    const [selectedLayer, setSelectedLayer] = useState();
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

    const fetchClothing = async () => {
        try {
            const [topsRes, bottomsRes, layersRes] = await Promise.all([
                axios.get('https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/api/images/tops'),
                axios.get('https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/api/images/bottoms'),
                axios.get('https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/api/images/layers')
            ]);

            setTops(topsRes.data);
            setBottoms(bottomsRes.data);
            setLayers(layersRes.data);

            filterClothing(topsRes.data, bottomsRes.data, layersRes.data);
        } catch (error) {
            console.error('Error fetching clothing data:', error);
        }
    };

    // Perform filtering based on temperature
    const filterClothing = (topsData, bottomsData, layersData) => {
        console.log('Filtering clothing based on temperature:', temp);
        let newFilteredTops = topsData.slice();
        let newFilteredBottoms = bottomsData.slice();
        let newFilteredLayers = layersData.slice();

        if (temp > 75) {
            newFilteredTops = newFilteredTops.filter(top => top.subcategory !== 'long-sleeve');
            newFilteredBottoms = newFilteredBottoms.filter(bottom => bottom.subcategory === 'shorts');
            newFilteredLayers = []; 
        } else if (temp > 45) {
            newFilteredTops = newFilteredTops.filter(top => top.subcategory !== 'tank-top');
            newFilteredBottoms = newFilteredBottoms.filter(bottom => bottom.subcategory !== 'shorts');
            newFilteredLayers = newFilteredLayers.filter(layer => layer.subcategory !== 'jacket');
        } else {
            newFilteredTops = newFilteredTops.filter(top => top.subcategory !== 'tank-top');
            newFilteredBottoms = newFilteredBottoms.filter(bottom => bottom.subcategory !== 'shorts');
            newFilteredLayers = newFilteredLayers.filter(layer => layer.subcategory !== 'flannel');
        }

        setFilteredTops(newFilteredTops);
        setFilteredBottoms(newFilteredBottoms);
        setFilteredLayers(newFilteredLayers);
    };


    useEffect(() => {
        getWeatherForLocation();
        if (temp !== null) {
            fetchClothing();
        }
    }, [temp]); 


    function distance(x1, y1, z1, x2, y2, z2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
    }

    function rgbToColor(r, g, b) {
        const normedColor = [r, g, b].map(color => color / 255);
        const colors = {
            Red: [1, 0, 0],
            Green: [0, 1, 0],
            Blue: [0, 0, 1],
            Magenta: [1, 0, 1],
            Yellow: [1, 1, 0],
            Cyan: [0, 1, 1],
            Black: [0, 0, 0],
            White: [1, 1, 1],
            Brown: [0.64, 0.16, 0.16],
            Orange: [1, 0.64, 0],
            Purple: [0.62, 0, 1],
            Pink: [1, 0.55, 0.63],
            Grey: [0.5, 0.5, 0.5],
            Tan: [0.82, 0.71, 0.55]
        };

        let closestColor = '';
        let smallestDistance = Infinity;

        for (const [colorName, colorValue] of Object.entries(colors)) {
            const dist = distance(normedColor[0], normedColor[1], normedColor[2], colorValue[0], colorValue[1], colorValue[2]);
            if (dist < smallestDistance) {
                smallestDistance = dist;
                closestColor = colorName;
            }
        }

        return closestColor;
    }

    function generateOutfit() {
        if (filteredTops.length === 0) {
            console.warn('No tops available');
            return;
        }

    
        const randomTop = filteredTops[Math.floor(Math.random() * filteredTops.length)];
        const topColor = rgbToColor(randomTop.colors[0], randomTop.colors[1], randomTop.colors[2]);
        console.log(`Selected Top Color: ${topColor}`, randomTop);
        const neutralBottoms = filteredBottoms.filter(bottom => {
            const bottomColor = rgbToColor(bottom.colors[0], bottom.colors[1], bottom.colors[2]);
            return ['Black', 'Brown', 'Tan', 'Grey', 'White'].includes(bottomColor);
        });
        const neutralLayers = filteredLayers.filter(layer => {
            const layerColor = rgbToColor(layer.colors[0], layer.colors[1], layer.colors[2]);
            return ['Black', 'Brown', 'Tan', 'Grey', 'White'].includes(layerColor);
        });
    
        const randomBottom = neutralBottoms.length > 0
            ? neutralBottoms[Math.floor(Math.random() * neutralBottoms.length)]
            : filteredBottoms[Math.floor(Math.random() * filteredBottoms.length)];
        const bottomColor = rgbToColor(randomBottom.colors[0], randomBottom.colors[1], randomBottom.colors[2]);
        console.log(`Selected Bottom Color: ${bottomColor}`, randomBottom);
        const randomLayer = neutralLayers.length > 0
            ? neutralLayers[Math.floor(Math.random() * neutralLayers.length)]
            : filteredLayers[Math.floor(Math.random() * filteredLayers.length)];
        const layerColor = randomLayer ? rgbToColor(randomLayer.colors[0], randomLayer.colors[1], randomLayer.colors[2]) : 'No layer selected';
        console.log(`Selected Layer Color: ${layerColor}`, randomLayer);
        setSelectedTop(randomTop);
        setSelectedBottom(randomBottom);
        setSelectedLayer(randomLayer);

        
        
    }
    

    return (
        
        <div>
            
    <Navbar />
    <div className="main-container">
        <div className="outfit-container">
            {selectedLayer ? (
                <img src={`https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/uploads/${selectedLayer.filename}`} alt="Layer" className="generated-image"/>
            ) : (
                <div className="blank-image"></div>
            )}

            {selectedTop ? (
                <img src={`https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/uploads/${selectedTop.filename}`} alt="Top" className="generated-image"/>
            ) : (
                <div className="blank-image"></div>
            )}

            {selectedBottom ? (
                <img src={`https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/uploads/${selectedBottom.filename}`} alt="Bottom" className="generated-image"/>
            ) : (
                <div className="blank-image"></div>
            )}

            <button disabled={loadingTemp || temp === null} className="generate-button" onClick={generateOutfit}>{loadingTemp ? 'Loading Weather...' : 'Generate Fit'}</button>
        </div>
    </div>
</div>

    );
}

export default GeneratedFits;
