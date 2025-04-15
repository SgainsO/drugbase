import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaArrowLeft, FaDna } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import DrugSearch from '../components/DrugSearch';
import DrugDetails from '../components/DrugDetails';
import { processDrugData } from '../utils/dataProcessing';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Content page component
 * @returns {JSX.Element} - Rendered component
 */
const ContentPage = () => {
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [queryMode, setQueryMode] = useState('drug'); // 'drug', 'disease', or 'multi'
  const [minDiseases, setMinDiseases] = useState(2); // Minimum number of diseases for multi-disease mode
  const starsRef = useRef(null);

  // Create stars in the background
  useEffect(() => {
    if (starsRef.current) {
      const container = starsRef.current;
      const starCount = 100;
      
      // Clear any existing stars
      container.innerHTML = '';
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = `star star-${Math.floor(Math.random() * 3) + 1}`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(star);
      }
    }
  }, []);

  // Toggle search mode between drug, disease, and multi-disease
  const toggleQueryMode = () => {
    setQueryMode(prevMode => {
      if (prevMode === 'drug') return 'disease';
      if (prevMode === 'disease') return 'multi';
      return 'drug';
    });
    setSelectedDrug(null);
  };
  
  // Handle minimum diseases change for multi-disease mode
  const handleMinDiseasesChange = (value) => {
    setMinDiseases(value);
    setSelectedDrug(null);
  };

  // Handle drug selection
  const handleDrugSelect = (drugData) => {
    const processedDrug = processDrugData(drugData, queryMode);
    setSelectedDrug(processedDrug);
  };

  return (
    <div className="content-page">
      <div ref={starsRef} className="stars-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}></div>
      
      <div className="container">
        <nav className="space-navbar">
          <div className="space-logo">
            <FaRocket /> DrugBase
          </div>
          <div>
            <Link to="/">
              <button className="space-button">
                <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Home
              </button>
            </Link>
          </div>
        </nav>

        <motion.div 
          className="content-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ padding: '40px 0' }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            style={{ textAlign: 'center', marginBottom: '40px' }}
          >
            Explore The Cosmic Drug Database
          </motion.h1>

          {/* Drug Search Component */}
          <DrugSearch 
            queryMode={queryMode}
            minDiseases={minDiseases}
            onDrugSelect={handleDrugSelect}
            onModeToggle={toggleQueryMode}
            onMinDiseasesChange={handleMinDiseasesChange}
          />

          {/* Drug Details Component */}
          {selectedDrug && <DrugDetails selectedDrug={selectedDrug} />}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentPage;
