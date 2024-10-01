import ClothSelector from './ClothSelector/ClothSelector.jsx'
import Navbar from './Navbar/Navbar.jsx'

function App() {
  
  return (
      <>
      <Navbar />
      <div className='container'>
        <ClothSelector />
        <ClothSelector />
        <ClothSelector />
      </div>
      </>
  );
}

export default App
