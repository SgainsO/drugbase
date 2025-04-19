import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const PaginationControls = ({ onPrevPage, onNextPage, hasPrevPage, hasNextPage }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '20px' }}>
      <button 
        className="space-button"
        onClick={onPrevPage}
        disabled={!hasPrevPage}
        style={{ 
          opacity: !hasPrevPage ? 0.5 : 1,
          cursor: !hasPrevPage ? 'not-allowed' : 'pointer'
        }}
      >
        <FaChevronLeft /> Previous
      </button>
      
      <button 
        className="space-button"
        onClick={onNextPage}
        disabled={!hasNextPage}
        style={{ 
          opacity: !hasNextPage ? 0.5 : 1,
          cursor: !hasNextPage ? 'not-allowed' : 'pointer'
        }}
      >
        Next <FaChevronRight />
      </button>
    </div>
  );
};

export default PaginationControls;
