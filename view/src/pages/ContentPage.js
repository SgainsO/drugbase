import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaSearch, FaArrowLeft, FaAtom, FaChartLine } from 'react-icons/fa';
import HeartAttackGraph from '../components/HeartAttackGraph';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

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

// Mock drug database
const mockDrugDatabase = [
  {
    id: 1,
    name: 'Nebuloxin',
    genericName: 'Nebulox',
    category: 'Anti-inflammatory',
    manufacturer: 'Cosmic Pharmaceuticals',
    price: 299.99,
    genericPrice: 149.99,
    treatment: ['Rheumatoid Arthritis', 'Chronic Inflammation'],
    effectiveness: [65, 70, 75, 78, 82, 85, 88],
    sideEffects: [20, 18, 15, 14, 12, 10, 8],
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    description: 'A cosmic anti-inflammatory drug derived from nebula particles.'
  },
  {
    id: 2,
    name: 'Stellaracetam',
    genericName: 'Stellacet',
    category: 'Anticonvulsant',
    manufacturer: 'Stellar Meds',
    price: 399.99,
    genericPrice: 199.99,
    treatment: ['Epilepsy', 'Seizure Disorders'],
    effectiveness: [50, 55, 65, 75, 80, 85, 90],
    sideEffects: [30, 25, 20, 18, 15, 12, 10],
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    description: 'An anticonvulsant medication infused with stellar energy.'
  },
  {
    id: 3,
    name: 'Galaxidol',
    genericName: 'Galaxin',
    category: 'Analgesic',
    manufacturer: 'Galactic Health',
    price: 199.99,
    genericPrice: 89.99,
    treatment: ['Chronic Pain', 'Neuropathic Pain'],
    effectiveness: [70, 72, 75, 78, 80, 85, 88],
    sideEffects: [25, 22, 20, 18, 15, 12, 10],
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    description: 'A powerful pain reliever that harnesses the power of galactic waves.'
  },
  {
    id: 4,
    name: 'Cosmopril',
    genericName: 'Cosmoprilate',
    category: 'Antihypertensive',
    manufacturer: 'Cosmic Care',
    price: 249.99,
    genericPrice: 129.99,
    treatment: ['Hypertension', 'Heart Disease'],
    effectiveness: [60, 65, 70, 75, 80, 82, 85],
    sideEffects: [15, 14, 13, 12, 10, 9, 8],
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    description: 'A blood pressure medication that brings cosmic harmony to your cardiovascular system.'
  },
  {
    id: 5,
    name: 'Astrozolam',
    genericName: 'Astrozol',
    category: 'Anxiolytic',
    manufacturer: 'Astral Pharmaceuticals',
    price: 179.99,
    genericPrice: 79.99,
    treatment: ['Anxiety Disorders', 'Panic Attacks'],
    effectiveness: [75, 78, 80, 82, 85, 87, 90],
    sideEffects: [35, 30, 25, 20, 15, 12, 10],
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    description: 'An anxiety medication that aligns your neural pathways with the stars.'
  }
];

const ContentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [filteredDrugs, setFilteredDrugs] = useState(mockDrugDatabase);
  const [queryMode, setQueryMode] = useState('drug'); // 'drug' or 'disease'
  const starsRef = useRef(null);
  const graphRef = useRef(null);

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

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredDrugs(mockDrugDatabase);
    } else {
      const filtered = mockDrugDatabase.filter(drug => {
        if (queryMode === 'drug') {
          return drug.name.toLowerCase().includes(term.toLowerCase()) ||
                 drug.genericName.toLowerCase().includes(term.toLowerCase()) ||
                 drug.category.toLowerCase().includes(term.toLowerCase()) ||
                 drug.description.toLowerCase().includes(term.toLowerCase());
        } else {
          return drug.treatment.some(disease => 
            disease.toLowerCase().includes(term.toLowerCase())
          );
        }
      });
      setFilteredDrugs(filtered);
    }
  };

  const toggleQueryMode = () => {
    setQueryMode(prevMode => prevMode === 'drug' ? 'disease' : 'drug');
    setSearchTerm('');
    setFilteredDrugs(mockDrugDatabase);
    setSelectedDrug(null);
  };

  // Handle drug selection
  const handleDrugSelect = (drug) => {
    setSelectedDrug(drug);
    setShowGraph(false);
    
    // Reset graph animation
    setTimeout(() => {
      setShowGraph(true);
    }, 100);
  };

  // Chart data for effectiveness
  const effectivenessData = {
    labels: selectedDrug?.years || [],
    datasets: [
      {
        label: 'Effectiveness (%)',
        data: selectedDrug?.effectiveness || [],
        borderColor: 'rgba(110, 59, 255, 1)',
        backgroundColor: 'rgba(110, 59, 255, 0.2)',
        pointBackgroundColor: 'rgba(110, 59, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(110, 59, 255, 1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Chart data for side effects
  const sideEffectsData = {
    labels: selectedDrug?.years || [],
    datasets: [
      {
        label: 'Side Effects (%)',
        data: selectedDrug?.sideEffects || [],
        borderColor: 'rgba(201, 97, 255, 1)',
        backgroundColor: 'rgba(201, 97, 255, 0.2)',
        pointBackgroundColor: 'rgba(201, 97, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(201, 97, 255, 1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: selectedDrug ? `${selectedDrug.name} Data Over Time` : '',
        color: 'white',
        font: {
          size: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(16, 20, 38, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(110, 59, 255, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };


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

          <div className="search-section space-card" style={{ marginBottom: '40px', padding: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Query The Database</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <button 
                className="space-button glow-effect"
                onClick={toggleQueryMode}
                style={{ marginBottom: '20px' }}
              >
                <FaAtom style={{ marginRight: '8px' }} /> 
                Current Mode: {queryMode === 'drug' ? 'Drug Search' : 'Disease Search'}
              </button>
            </div>
            
            <div className="search-input-container" style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--space-text-secondary)' }} />
              <input 
                type="text" 
                className="space-input" 
                placeholder={queryMode === 'drug' ? 
                  "Search by drug name, generic name, or category..." : 
                  "Search by disease or condition..."}
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ paddingLeft: '45px' }}
              />
            </div>
            
            <div className="search-results" style={{ marginTop: '20px' }}>
              {filteredDrugs.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {filteredDrugs.map(drug => (
                    <motion.div 
                      key={drug.id}
                      className="space-card glow-effect"
                      whileHover={{ y: -5, boxShadow: '0 0 20px rgba(110, 59, 255, 0.6)' }}
                      whileTap={{ y: 0 }}
                      onClick={() => handleDrugSelect(drug)}
                      style={{ 
                        cursor: 'pointer',
                        border: selectedDrug?.id === drug.id ? '2px solid var(--space-accent)' : '1px solid var(--space-card-border)'
                      }}
                    >
                      {queryMode === 'drug' ? (
                        <>
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaAtom color="var(--space-accent)" /> {drug.name}
                          </h3>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Generic: {drug.genericName}
                          </p>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Treatment: {drug.treatment.join(', ')}
                          </p>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Manufacturer: {drug.manufacturer}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaAtom color="var(--space-accent)" /> {drug.treatment.join(', ')}
                          </h3>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Drug: {drug.name} (${drug.price})
                          </p>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Generic: {drug.genericName} (${drug.genericPrice})
                          </p>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-card" style={{ textAlign: 'center', padding: '30px' }}>
                  <p>No drugs found in this sector of the galaxy. Try a different search term.</p>
                </div>
              )}
            </div>
          </div>

          {selectedDrug && (
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
                <p><strong>Category:</strong> {selectedDrug.category}</p>
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
                
                <HeartAttackGraph isVisible={showGraph}>
                  <div style={{ marginBottom: '40px', justifyContent: 'center', alignItems: 'center'}}>
                    <Bar 
                      data={{
                        labels: ['Price Comparison'],
                        datasets: [
                          {
                            label: 'Brand Name Price',
                            data: [selectedDrug?.price || 0],
                            backgroundColor: 'rgba(110, 59, 255, 0.8)',
                            borderColor: 'rgba(110, 59, 255, 1)',
                            borderWidth: 1
                          },
                          {
                            label: 'Generic Price',
                            data: [selectedDrug?.genericPrice || 0],
                            backgroundColor: 'rgba(201, 97, 255, 0.8)',
                            borderColor: 'rgba(201, 97, 255, 1)',
                            borderWidth: 1
                          }
                        ]
                      }}
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
                  
                  <div style={{ marginBottom: '40px' }}>
                  </div>
                  
                  <div>
                  </div>
                </HeartAttackGraph>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentPage;
