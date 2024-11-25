import { useState,useEffect } from "react";
import Navbar from "./NavBar/NavBar.jsx";
import axios from "axios";

function SavedFits() {

    const [savedFits, setSavedFits] = useState([]);

    useEffect(() => {
        const fetchSavedFits = async () => {
          try {
            const response = await axios.get('https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/api/saved-fits');
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
          <p className="no-fits">No saved fits yet.</p>
        ) : (
          savedFits.map((fit, index) => {
            return (
              <div key={index} className="saved-fit">
                {fit.layer ? (<img src={`https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/uploads/${fit.layer.filename}`} alt="Layer" className="fit-image" />) : (<div className="blank-image"></div>)}
                {fit.top ? (<img src={`https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/uploads/${fit.top.filename}`} alt="Top" className="fit-image" />) : (<div className="blank-image"></div>)}
                {fit.bottom ? (<img src={`https://fit-finder-server-cafdcuckbbche3c9.centralus-01.azurewebsites.net/uploads/${fit.bottom.filename}`} alt="Bottom" className="fit-image" />) : (<div className="blank-image"></div>)}
              </div>
            );
          })
        )}
      </div>
      </>
  );
}


export default SavedFits;