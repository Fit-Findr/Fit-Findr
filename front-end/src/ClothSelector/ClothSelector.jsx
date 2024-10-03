import styles from './ClothSelector.module.css';
import { useState,useEffect } from 'react';
import axios from 'axios';

function ClothSelector() {

    const numArray = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [index, setIndex] = useState(0);

    function next() {
        setIndex(index === numArray.length-1 ? 0 : index + 1);
    }

    function prev() {
        setIndex(index === 0 ? numArray.length-1 : index - 1);
    }


    const [imageUrls, setImageUrls] = useState([]);
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/images');
                // Construct full URLs for all images
                const urls = response.data.map(filename => `http://localhost:8080/uploads/${filename}`);
                setImageUrls(urls);
                if (urls.length > 0) {
                    setCurrentImageUrl(urls[0]); 
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []); 

    return (
        <div className={styles.clothContainer}>

            <div className={styles.buttonContainerLeft}>
                <button className={styles.button} onClick={prev}>prev</button>
            </div>


            <div className={styles.imageContainer}>
                {currentImageUrl && (  // Check if currentImageUrl is not empty
                    <img 
                        src={currentImageUrl} 
                        alt="Fetched Cloth" 
                        className={styles.clothImage}
                    />
                )}
            </div>


            <div className={styles.buttonContainerRight}>
                <button className={styles.button} onClick={next}>next</button>
            </div>

        </div>
        
    );
}

export default ClothSelector;