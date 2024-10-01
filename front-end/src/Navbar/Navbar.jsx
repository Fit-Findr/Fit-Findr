import styles from './Navbar.module.css';

function Navbar() {
    return (
        <div className={styles.navbar}>
            <h1>Fit Finder</h1>
            <ul>
                <li>Add Fits</li>
                <li>Sign in</li>
            </ul>
        </div>
        
    );
}

export default Navbar;