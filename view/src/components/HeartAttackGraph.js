import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HeartAttackGraph component for animated graph reveal
 * @param {Object} props - Component props
 * @param {boolean} props.isVisible - Whether the graph is visible
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} - Rendered component
 */
const HeartAttackGraph = ({ isVisible, children }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.8
          }}
          style={{ 
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '12px',
            padding: '20px',
            background: 'rgba(16, 20, 38, 0.5)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeartAttackGraph;
