import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaAtom, FaChartLine, FaDna } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import PriceCompareGraph from './PriceCompareGraph';
import SpaceLoader from './SpaceLoader';
import { getChartOptions, getPriceComparisonData } from '../utils/dataProcessing';

/**
 * Drug details component
 * @param {Object} props - Component props
 * @param {Object} props.selectedDrug - The selected drug data
 * @returns {JSX.Element} - Rendered component
 */
const DrugDetails = ({ selectedDrug }) => {
  const [showGraph, setShowGraph] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const graphRef = useRef(null);
  
  // Safely determine if this is a multi-disease drug
  const isMultiDiseaseDrug = selectedDrug && selectedDrug.diseaseCount !== undefined;
  
  // Simulate loading effect when drug changes
  useEffect(() => {
    if (selectedDrug) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Show loading animation for 1 second
      
      return () => clearTimeout(timer);
    }
  }, [selectedDrug]);
  
  // Chart options
  const chartOptions = getChartOptions(selectedDrug);
  
  // Price comparison data
  const priceComparisonData = getPriceComparisonData(selectedDrug);
  
  // Floating particles animation for graph reveal
  const createParticles = () => {
    if (graphRef.current) {
      const container = graphRef.current;
      const particleCount = 30;
      
      // Clear any existing particles
      const existingParticles = container.querySelectorAll('.particle');
      existingParticles.forEach(particle => particle.remove());
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.5 + 0.5})`;
        particle.style.borderRadius = '50%';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.boxShadow = '0 0 10px rgba(110, 59, 255, 0.8)';
        
        // Animation
        particle.style.animation = `
          float ${Math.random() * 3 + 2}s infinite ease-in-out,
          pulse ${Math.random() * 2 + 1}s infinite ease-in-out
        `;
        
        container.appendChild(particle);
      }
    }
  };

  // Trigger particle animation when graph is shown
  useEffect(() => {
    if (showGraph) {
      createParticles();
    }
  }, [showGraph]);

  // Reset graph animation when selected drug changes
  useEffect(() => {
    setShowGraph(false);
    
    // Reset graph animation
    setTimeout(() => {
      setShowGraph(true);
    }, 100);
  }, [selectedDrug]);

  // Safety check - if no selected drug or invalid data, don't render anything
  if (!selectedDrug || typeof selectedDrug !== 'object') {
    return null;
  }

  return (
    <SpaceLoader isLoading={isLoading}>
      <motion.div 
        className="graph-section space-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}
      >
        <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaAtom color="var(--space-accent)" /> {selectedDrug.name} Analysis
        </h2>
        
        <div className="drug-details" style={{ marginBottom: '30px' }}>
          {isMultiDiseaseDrug && (
            <div style={{ 
              padding: '15px', 
              backgroundColor: 'rgba(110, 59, 255, 0.1)', 
              borderRadius: '8px',
              marginBottom: '20px',
              borderLeft: '4px solid var(--space-accent)'
            }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <FaDna color="var(--space-accent)" /> Broad-Spectrum Medication
              </h3>
              <p style={{ marginBottom: '10px' }}>
                This medication is effective against <strong>{selectedDrug.diseaseCount}</strong> different conditions, 
                making it a versatile treatment option.
              </p>
            </div>
          )}
          
          <p><strong>Generic Name:</strong> {selectedDrug.genericName}</p>
          <p><strong>Manufacturer:</strong> {selectedDrug.manufacturer}</p>
          <p><strong>Treatment for:</strong> {Array.isArray(selectedDrug.treatment) ? selectedDrug.treatment.join(', ') : selectedDrug.treatment}</p>
          <p><strong>Description:</strong> {selectedDrug.description}</p>
        </div>
        
        <div ref={graphRef} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <button 
              className="space-button glow-effect"
              onClick={() => setShowGraph(!showGraph)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <FaChartLine /> {showGraph ? 'Hide Cosmic Visualization' : 'Reveal Cosmic Visualization'}
            </button>
          </div>
          
          <PriceCompareGraph isVisible={showGraph}>
            <div style={{ marginBottom: '40px', justifyContent: 'center', alignItems: 'center'}}>
              <Bar 
                data={priceComparisonData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: selectedDrug ? `${selectedDrug.name} vs ${selectedDrug.genericName} Price Comparison` : ''
                    }
                  }
                }}
              />
            </div>
          </PriceCompareGraph>
        </div>
      </motion.div>
    </SpaceLoader>
  );
};

export default DrugDetails;
