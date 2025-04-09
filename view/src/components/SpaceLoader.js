import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Space-themed loading animation component
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether the component is in loading state
 * @param {React.ReactNode} props.children - Content to display when not loading
 * @returns {JSX.Element} - Rendered component
 */
const SpaceLoader = ({ isLoading, children }) => {
  const canvasRef = useRef(null);
  
  // Create cosmic particle animation
  useEffect(() => {
    if (!isLoading || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 100;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.color = `hsl(${Math.random() * 60 + 200}, 100%, ${Math.random() * 30 + 50}%)`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw cosmic background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0, 
        canvas.width / 2, 
        canvas.height / 2, 
        canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(16, 24, 64, 0.6)');
      gradient.addColorStop(1, 'rgba(8, 12, 32, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Draw pulsing planet
      const time = Date.now() * 0.001;
      const pulseSize = Math.sin(time) * 5 + 40; // Pulsing effect
      
      // Planet glow
      ctx.shadowBlur = 30;
      ctx.shadowColor = 'rgba(110, 59, 255, 0.8)';
      
      // Draw planet
      const planetGradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0, 
        canvas.width / 2, 
        canvas.height / 2, 
        pulseSize
      );
      planetGradient.addColorStop(0, 'rgba(110, 59, 255, 1)');
      planetGradient.addColorStop(0.5, 'rgba(201, 97, 255, 0.8)');
      planetGradient.addColorStop(1, 'rgba(110, 59, 255, 0.1)');
      
      ctx.fillStyle = planetGradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw orbital ring
      ctx.strokeStyle = 'rgba(201, 97, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize + 20, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw orbiting moon
      const moonX = canvas.width / 2 + Math.cos(time * 2) * (pulseSize + 20);
      const moonY = canvas.height / 2 + Math.sin(time * 2) * (pulseSize + 20);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Loading text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Scanning Cosmic Database...', canvas.width / 2, canvas.height / 2 + pulseSize + 60);
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isLoading]);
  
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: '100%',
            height: '300px',
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpaceLoader;
