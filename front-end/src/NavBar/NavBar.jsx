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
          <li>Sign in</li>
          <Link to="/" className={styles.routeLink}>
          <li>Home</li>
          </Link>
        </ul>
      </div>
  );
}

export default Navbar;