import styles from './Navbar.module.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
function Navbar() {
  return (
    <div className={styles.navbar}>
        <h1>Fit Finder</h1>
        <ul>
          <Link to="/add-fits" className={styles.routeLink}>
          <li>Add Fits</li>
          </Link>
          <Link to="/saved-fits" className={styles.routeLink}>
          <li>Saved Fits</li>
          </Link>
          <Link to="/generate-fits" className={styles.routeLink}>
          <li>Generate</li>
          </Link>
          <Link to="/" className={styles.routeLink}>
          <li>Home</li>
          </Link>
        </ul>
      </div>
  );
}

export default Navbar;