import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const HeartAttackGraph = ({ children, isVisible }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showChildren, setShowChildren] = useState(false);
  const explosionRef = useRef(null);

  // Create explosion particles
  const createExplosionParticles = () => {
    if (explosionRef.current) {
      const container = explosionRef.current;
      const particleCount = 50;
      
      // Clear any existing particles
      container.innerHTML = '';
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 5px and 15px
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random color - purples, blues, and pinks for space theme
        const hue = Math.floor(Math.random() * 60) + 240; // 240-300 range for purples/blues
        const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
        const lightness = Math.floor(Math.random() * 30) + 50; // 50-80%
        particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Random position - centered around the middle
        particle.style.top = '50%';
        particle.style.left = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        
        // Random border-radius for different shapes
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : `${Math.random() * 50}%`;
        
        // Add glow effect
        particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px rgba(110, 59, 255, 0.8)`;
        
        // Add to container
        container.appendChild(particle);
        
        // Animate the particle outward
        setTimeout(() => {
          const angle = Math.random() * Math.PI * 2; // Random angle in radians
          const distance = Math.random() * 300 + 100; // Random distance
          const duration = Math.random() * 1 + 1; // Random duration between 1-2s
          
          particle.style.transition = `all ${duration}s cubic-bezier(0.215, 0.610, 0.355, 1.000)`;
          particle.style.transform = `translate(
            calc(-50% + ${Math.cos(angle) * distance}px), 
            calc(-50% + ${Math.sin(angle) * distance}px)
          )`;
          particle.style.opacity = '0';
        }, 10);
      }
    }
  };

  // Sequence the animation when isVisible changes
  useEffect(() => {
    if (isVisible) {
      // Step 1: Show warning
      setShowWarning(true);
      
      // Step 2: After 1.5s, show explosion
      const explosionTimer = setTimeout(() => {
        setShowWarning(false);
        setShowExplosion(true);
        createExplosionParticles();
        
        // Add heart attack class to body for screen shake
        document.body.classList.add('heart-attack');
        
        // Remove heart attack class after animation completes
        setTimeout(() => {
          document.body.classList.remove('heart-attack');
        }, 800);
      }, 1500);
      
      // Step 3: After explosion (1s), show the actual graph
      const graphTimer = setTimeout(() => {
        setShowChildren(true);
      }, 2500);
      
      return () => {
        clearTimeout(explosionTimer);
        clearTimeout(graphTimer);
        document.body.classList.remove('heart-attack');
      };
    } else {
      setShowWarning(false);
      setShowExplosion(false);
      setShowChildren(false);
    }
  }, [isVisible]);

  // Warning animation variants
  const warningVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        repeat: 3,
        repeatType: "reverse"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.5,
      transition: { duration: 0.3 }
    }
  };

  // Explosion animation variants
  const explosionVariants = {
    hidden: { opacity: 0, scale: 0.2 },
    visible: { 
      opacity: 1, 
      scale: 1.5,
      transition: { 
        duration: 0.5,
        ease: [0.215, 0.610, 0.355, 1.000]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 2,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <AnimatePresence>
        {showWarning && (
          <motion.div
            variants={warningVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaExclamationTriangle size={100} color="#ff5e00" />
            <h2 style={{ color: '#ff5e00', marginTop: '20px', textAlign: 'center' }}>
              WARNING: EXTREME DATA VISUALIZATION IMMINENT
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExplosion && (
          <motion.div
            variants={explosionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              width: '100%',
              height: '100%'
            }}
          >
            <div 
              ref={explosionRef} 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                overflow: 'hidden'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChildren && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ 
              opacity: 1, 
              filter: 'blur(0px)',
              transition: { duration: 1, delay: 0.2 }
            }}
            exit={{ opacity: 0 }}
            className="graph-animation"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeartAttackGraph;
