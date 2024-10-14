import ClothSelector from "./ClothSelector/ClothSelector.jsx";
import Navbar from "./Navbar/Navbar.jsx";
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
    const temp = 90;

    const fetchClothing = async () => {
        try {
            const [topsRes, bottomsRes, layersRes] = await Promise.all([
                axios.get('http://localhost:8080/api/images/tops'),
                axios.get('http://localhost:8080/api/images/bottoms'),
                axios.get('http://localhost:8080/api/images/layers')
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
        fetchClothing();
    }, []); 


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
        // Check if filteredTops is empty
        if (filteredTops.length === 0) {
            console.warn('No tops available');
            return;
        }
    
        const randomTop = filteredTops[Math.floor(Math.random() * filteredTops.length)];
        const topColor = rgbToColor(randomTop.colors[0], randomTop.colors[1], randomTop.colors[2]);
    
        const neutralBottoms = filteredBottoms.length > 0 ? filteredBottoms.filter(bottom => {
            const bottomColor = rgbToColor(bottom.colors[0], bottom.colors[1], bottom.colors[2]);
            return ['Black', 'Brown', 'Tan', 'Grey', 'White'].includes(bottomColor);
        }) : [];
    
        const relatedBottoms = filteredBottoms.length > 0 ? filteredBottoms.filter(bottom => {
            const bottomColor = rgbToColor(bottom.colors[0], bottom.colors[1], bottom.colors[2]);
            const dist = distance(
                randomTop.colors[0] / 255, randomTop.colors[1] / 255, randomTop.colors[2] / 255,
                bottom.colors[0] / 255, bottom.colors[1] / 255, bottom.colors[2] / 255
            );
            return dist <= 0.2;
        }) : [];
    
        
        const neutralLayers = filteredLayers.length > 0 ? filteredLayers.filter(layer => {
            const layerColor = rgbToColor(layer.colors[0], layer.colors[1], layer.colors[2]);
            return ['Black', 'Brown', 'Tan', 'Grey', 'White'].includes(layerColor);
        }) : [];
    
        const relatedLayers = filteredLayers.length > 0 ? filteredLayers.filter(layer => {
            const layerColor = rgbToColor(layer.colors[0], layer.colors[1], layer.colors[2]);
            const dist = distance(
                randomTop.colors[0] / 255, randomTop.colors[1] / 255, randomTop.colors[2] / 255,
                layer.colors[0] / 255, layer.colors[1] / 255, layer.colors[2] / 255
            );
            return dist <= 0.2;
        }) : [];
    
        // Randomly select a bottom
        const randomBottom = relatedBottoms.length > 0 
            ? relatedBottoms[Math.floor(Math.random() * relatedBottoms.length)] 
            : (neutralBottoms.length > 0 
                ? neutralBottoms[Math.floor(Math.random() * neutralBottoms.length)] 
                : filteredBottoms[Math.floor(Math.random() * filteredBottoms.length)]);
    
        // Randomly select a layer
        const randomLayer = relatedLayers.length > 0 
            ? relatedLayers[Math.floor(Math.random() * relatedLayers.length)] 
            : (neutralLayers.length > 0 
                ? neutralLayers[Math.floor(Math.random() * neutralLayers.length)] 
                : filteredLayers[Math.floor(Math.random() * filteredLayers.length)]);
    

        setSelectedTop(randomTop);
        setSelectedBottom(randomBottom);
        setSelectedLayer(randomLayer);
    }
    

    return (
        <div>
    <Navbar />
    <div className="main-container">
        <div className="outfit-container">
            {/* Layer: Image or placeholder */}
            {selectedLayer ? (
                <img src={`http://localhost:8080/uploads/${selectedLayer.filename}`} alt="Layer" className="generated-image"/>
            ) : (
                <div className="blank-image"></div>
            )}

            {/* Top: Image or placeholder */}
            {selectedTop ? (
                <img src={`http://localhost:8080/uploads/${selectedTop.filename}`} alt="Top" className="generated-image"/>
            ) : (
                <div className="blank-image"></div>
            )}

            {/* Bottom: Image or placeholder */}
            {selectedBottom ? (
                <img src={`http://localhost:8080/uploads/${selectedBottom.filename}`} alt="Bottom" className="generated-image"/>
            ) : (
                <div className="blank-image"></div>
            )}

            <button className="generate-button" onClick={generateOutfit}>Generate Outfit</button>
        </div>
    </div>
</div>

    );
}

export default GeneratedFits;
