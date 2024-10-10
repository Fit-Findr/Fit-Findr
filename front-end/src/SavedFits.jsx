import { useState,useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import axios from "axios";

function SavedFits() {

    const [savedFits, setSavedFits] = useState([]);

    useEffect(() => {
        const fetchSavedFits = async () => {
          try {
            const response = await axios.get('http://localhost:8080/api/saved-fits');
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
                {fit.layer ? (<img src={`http://localhost:8080/uploads/${fit.layer.filename}`} alt="Layer" className="fit-image" />) : (<div className="blank-image"></div>)}
                {fit.top ? (<img src={`http://localhost:8080/uploads/${fit.top.filename}`} alt="Top" className="fit-image" />) : (<div className="blank-image"></div>)}
                {fit.bottom ? (<img src={`http://localhost:8080/uploads/${fit.bottom.filename}`} alt="Bottom" className="fit-image" />) : (<div className="blank-image"></div>)}
              </div>
            );
          })
        )}
      </div>
      </>
  );
}


export default SavedFits;