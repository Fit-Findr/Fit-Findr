import styles from './ClothSelector.module.css';
import { useState } from 'react';

function ClothSelector() {

    const numArray = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [index, setIndex] = useState(0);

    function next() {
        setIndex(index === numArray.length-1 ? 0 : index + 1);
    }

    function prev() {
        setIndex(index === 0 ? numArray.length-1 : index - 1);
    }
    return (
        <div className={styles.clothContainer}>

            <div className={styles.buttonContainerLeft}>
                <button className={styles.button} onClick={prev}>prev</button>
            </div>


            <div className={styles.imageContainer}>
                <p>{numArray[index]}</p>
            </div>


            <div className={styles.buttonContainerRight}>
                <button className={styles.button} onClick={next}>next</button>
            </div>

        </div>
        
    );
}

export default ClothSelector;