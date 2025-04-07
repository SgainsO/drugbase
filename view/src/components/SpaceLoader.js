import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';

const SpaceLoader = () => {
  const starsRef = useRef(null);

  // Create stars in the background
  useEffect(() => {
    if (starsRef.current) {
      const container = starsRef.current;
      const starCount = 150;
      
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

  // Rocket animation variants
  const rocketVariants = {
    initial: { x: '-100vw', y: '50vh', rotate: 45 },
    animate: { 
      x: '150vw', 
      y: '-50vh',
      transition: { 
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  // Text animation variants
  const textVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: [0, 1, 1, 0],
      transition: { 
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1,
        times: [0, 0.1, 0.9, 1],
        ease: "easeInOut"
      }
    }
  };

  // Glow animation variants
  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: [0, 0.8, 0],
      scale: [0.8, 1.2, 0.8],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'var(--space-bg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div 
        ref={starsRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          overflow: 'hidden'
        }}
      />
      
      <motion.div
        variants={glowVariants}
        initial="initial"
        animate="animate"
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110, 59, 255, 0.4) 0%, rgba(110, 59, 255, 0) 70%)',
        }}
      />
      
      <motion.div
        variants={textVariants}
        initial="initial"
        animate="animate"
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '30px',
          background: 'var(--space-gradient-1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}
      >
        Initializing DrugBase
      </motion.div>
      
      <div style={{ position: 'relative', width: '100%', height: '100px', overflow: 'hidden' }}>
        <motion.div
          variants={rocketVariants}
          initial="initial"
          animate="animate"
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaRocket size={40} color="var(--space-accent)" />
          <div style={{
            position: 'absolute',
            width: '60px',
            height: '20px',
            background: 'linear-gradient(90deg, var(--space-accent) 0%, rgba(110, 59, 255, 0) 100%)',
            right: '30px',
            borderRadius: '50%',
            filter: 'blur(5px)',
            transform: 'rotate(180deg)'
          }} />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse'
          }
        }}
        style={{
          marginTop: '30px',
          fontSize: '1rem',
          color: 'var(--space-text-secondary)'
        }}
      >
        Traveling through the cosmos...
      </motion.div>
    </div>
  );
};

export default SpaceLoader;
