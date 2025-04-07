import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaDatabase, FaChartLine } from 'react-icons/fa';

const LandingPage = () => {
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

  return (
    <div className="landing-page">
      <div ref={starsRef} className="stars-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}></div>
      
      <div className="container">
        <nav className="space-navbar">
          <div className="space-logo">
            <FaRocket /> DrugBase
          </div>
          <div>
            <Link to="/content">
              <button className="space-button glow-effect">Explore Database</button>
            </Link>
          </div>
        </nav>

        <section className="hero-section">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              The Ultimate Galactic Drug Database
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              Explore the cosmos of pharmaceutical data with our advanced query system and enhanced interactive graphs. Discover connections and insights that were previously hidden in the vast universe of drug information.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              <Link to="/content">
                <button className="space-button pulse">
                  Check Out The Database
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            style={{ position: 'absolute', right: '5%', top: '20%', zIndex: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 1, type: 'spring' }}
          >
            <div className="floating" style={{ position: 'relative' }}>
              <div className="space-card" style={{ width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaDatabase size={100} color="var(--space-accent)" />
              </div>
              <div className="space-card" style={{ width: '150px', height: '150px', position: 'absolute', top: '-50px', right: '-50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaChartLine size={50} color="var(--space-accent)" />
              </div>
            </div>
          </motion.div>
        </section>

        <section className="features-section" style={{ padding: '80px 0', position: 'relative', zIndex: 2 }}>
          <motion.h2 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            Cosmic Features
          </motion.h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
            <motion.div 
              className="space-card"
              style={{ flex: '1 1 300px', maxWidth: '350px' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h3>Advanced Queries</h3>
              <p>Navigate through our vast database with precision and ease. Our query system allows you to find exactly what you're looking for in the pharmaceutical universe.</p>
            </motion.div>
            
            <motion.div 
              className="space-card"
              style={{ flex: '1 1 300px', maxWidth: '350px' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h3>Interactive Visualizations</h3>
              <p>Experience data like never before with our mind-blowing interactive graphs. Watch as connections form and insights materialize before your eyes.</p>
            </motion.div>
            
            <motion.div 
              className="space-card"
              style={{ flex: '1 1 300px', maxWidth: '350px' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <h3>Cosmic Insights</h3>
              <p>Uncover hidden patterns and relationships in drug data that traditional databases can't reveal. Our advanced algorithms bring clarity to complexity.</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
