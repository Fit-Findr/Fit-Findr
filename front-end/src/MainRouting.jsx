import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import AddFits from './AddFits.jsx';
import SavedFits from './SavedFits.jsx';
import GeneratedFits from './GeneratedFits.jsx';

function MainRouting() {
	
	return(

		<Router>
      		<Routes>
        		<Route path="/" element={<App />} />
        		<Route path="/add-fits" element={<AddFits />} />
				<Route path="/saved-fits" element={<SavedFits />} />
				<Route path="/generate-fits" element={<GeneratedFits />} />
      		</Routes>
    	</Router>
	);
}

export default MainRouting;