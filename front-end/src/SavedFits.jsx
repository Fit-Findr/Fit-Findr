import { useState,useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import axios from "axios";
import {baseUrl} from './main.jsx';

function SavedFits() {

    const [savedFits, setSavedFits] = useState([]);

    useEffect(() => {
        const fetchSavedFits = async () => {
          try {
            const response = await axios.get(`${baseUrl}/api/saved-fits`);
            setSavedFits(response.data); 
          } catch (error) {
            console.error('Error fetching saved fits:', error);
          }
        };
    
        fetchSavedFits();
      }, []);


    return (
        <>
        <Navbar />
        <div className="saved-fits-container">
        {savedFits.length === 0 ? (
          <p>No saved fits yet.</p>
        ) : (
          savedFits.map((fit, index) => {
            return (
              <div key={index} className="saved-fit">
                <img src={`${baseUrl}/uploads/${fit.layer.filename}`} alt="Layer" className="fit-image" />
                <img src={`${baseUrl}/uploads/${fit.top.filename}`} alt="Top" className="fit-image" />
                <img src={`${baseUrl}/uploads/${fit.bottom.filename}`} alt="Bottom" className="fit-image" />
              </div>
            );
          })
        )}
      </div>
      </>
  );
}


export default SavedFits;