import styles from './ClothSelector.module.css';
import { useState,useEffect } from 'react';

function ClothSelector({ images, onSelect }) {
    const [index, setIndex] = useState(0);

    const currentImage = images[index]; 

   
    function next() {
        setIndex(index === images.length - 1 ? 0 : index + 1);
    }

    
    function prev() {
        setIndex(index === 0 ? images.length - 1 : index - 1);
    }

    useEffect(() => {
        if (images[index]) {
            onSelect(images[index]);
        }
    }, [index, images, onSelect]);

    return (
        <div className={styles.clothContainer}>
            <div className={styles.buttonContainerLeft}>
                <button className={styles.button} onClick={prev}>←</button>
            </div>

            <div className={styles.imageContainer}>
                {currentImage ? ( 
                    <img 
                        src={`http://localhost:8080/uploads/${currentImage.filename}`}
                        alt={currentImage.category}
                        className={styles.clothImage}
                    />
                ) : (
                     <div className="blank-image-playground"></div>
                )}
            </div>

            <div className={styles.buttonContainerRight}>
                <button className={styles.button} onClick={next}>→</button>
            </div>
        </div>
    );
}

export default ClothSelector;