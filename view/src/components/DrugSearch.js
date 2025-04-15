import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaAtom, FaDna, FaPlus, FaMinus } from 'react-icons/fa';
import PaginationControls from './PaginationControls';
import SpaceLoader from './SpaceLoader';
import { fetchDrugData } from '../utils/api';
import { processDrugData } from '../utils/dataProcessing';

/**
 * Drug search component
 * @param {Object} props - Component props
 * @param {string} props.queryMode - The search mode ('drug', 'disease', or 'multi')
 * @param {number} props.minDiseases - Minimum number of diseases for multi-disease mode
 * @param {Function} props.onDrugSelect - Function to handle drug selection
 * @param {Function} props.onModeToggle - Function to handle mode toggle
 * @param {Function} props.onMinDiseasesChange - Function to handle minimum diseases change
 * @returns {JSX.Element} - Rendered component
 */
const DrugSearch = ({ 
  queryMode, 
  minDiseases = 2, 
  onDrugSelect, 
  onModeToggle, 
  onMinDiseasesChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drugResults, setDrugResults] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  // Fetch data from the API
  const fetchData = useCallback(async (resetPagination = false) => {
    // For multi-disease mode, we don't need a search term
    if (queryMode !== 'multi' && searchTerm.trim() === '') {
      setDrugResults([]);
      setHasMoreResults(false);
      return;
    }

    const currentId = resetPagination ? 0 : lastId;
    
    try {
      setLoading(true);
      const results = await fetchDrugData(searchTerm, currentId, queryMode, minDiseases);
      
      if (resetPagination) {
        setDrugResults(results);
      } else {
        setDrugResults(prev => [...prev, ...results]);
      }
      
      // Update pagination state
      setHasMoreResults(results.length >= 6); // If we got 6 or more results, there might be more
      
      // Update the last ID for pagination if we have results
      if (results.length > 0) {
        // For all modes, the DrugID is at index 1
        const maxId = Math.max(...results.map(item => item[1]));
        setLastId(maxId);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, queryMode, lastId, minDiseases]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Reset pagination when search term changes
    setLastId(0);
    
    if (term.trim() === '' && queryMode !== 'multi') {
      setDrugResults([]);
      setHasMoreResults(false);
    }
  };

  // Handle minimum diseases change
  const handleMinDiseasesChange = (change) => {
    const newValue = Math.max(1, minDiseases + change);
    onMinDiseasesChange(newValue);
    
    // Reset search results and trigger a new search with the updated minDiseases value
    if (queryMode === 'multi') {
      setLastId(0);
      setDrugResults([]);
      
      // Use setTimeout to ensure the minDiseases state is updated before fetching
      setTimeout(() => {
        fetchData(true);
      }, 100);
    }
  };

  // Fetch data when search term or minDiseases changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (queryMode === 'multi' || searchTerm.trim() !== '') {
        fetchData(true); // Reset pagination when search parameters change
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, queryMode, minDiseases, fetchData]);

  // Reset search when mode changes
  useEffect(() => {
    setSearchTerm('');
    setDrugResults([]);
    setLastId(0);
    setHasMoreResults(false);
    
    // Auto-fetch for multi-disease mode
    if (queryMode === 'multi') {
      // Use setTimeout to ensure fetchData is called after state updates
      setTimeout(() => {
        fetchData(true);
      }, 100);
    }
  }, [queryMode, fetchData]);

  // Handle pagination
  const handlePrevPage = () => {
    // For previous page, we need to reset and fetch with a lower ID
    // This is a simplified approach - in a real app, you might want to keep track of page history
    setLastId(Math.max(0, lastId - 12)); // Go back approximately 2 pages (12 items)
    fetchData(true);
  };

  const handleNextPage = () => {
    fetchData(false); // Fetch next page without resetting
  };

  // Get the current mode display text
  const getModeDisplayText = () => {
    switch (queryMode) {
      case 'drug': return 'Drug Search';
      case 'disease': return 'Disease Search';
      case 'multi': return 'Multi-Disease Treatment Search';
      default: return 'Drug Search';
    }
  };

  return (
    <div className="search-section space-card" style={{ marginBottom: '40px', padding: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>Query The Database</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="space-button glow-effect"
          onClick={onModeToggle}
          style={{ marginBottom: '20px' }}
        >
          <FaAtom style={{ marginRight: '8px' }} /> 
          Current Mode: {getModeDisplayText()}
        </button>
        
        {/* Min Diseases Control for Multi-Disease Mode */}
        {queryMode === 'multi' && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginTop: '15px',
            padding: '10px',
            backgroundColor: 'rgba(110, 59, 255, 0.1)',
            borderRadius: '8px'
          }}>
            <FaDna style={{ marginRight: '10px', color: 'var(--space-accent)' }} />
            <span style={{ marginRight: '15px' }}>Minimum Diseases:</span>
            <button 
              className="space-button"
              onClick={() => handleMinDiseasesChange(-1)}
              disabled={minDiseases <= 1}
              style={{ padding: '5px 10px', marginRight: '10px' }}
            >
              <FaMinus />
            </button>
            <span style={{ 
              padding: '5px 15px', 
              backgroundColor: 'rgba(110, 59, 255, 0.2)', 
              borderRadius: '4px',
              color: 'var(--space-accent)',
              fontWeight: 'bold'
            }}>
              {minDiseases}
            </span>
            <button 
              className="space-button"
              onClick={() => handleMinDiseasesChange(1)}
              style={{ padding: '5px 10px', marginLeft: '10px' }}
            >
              <FaPlus />
            </button>
          </div>
        )}
      </div>
      
      {/* Search Input (hidden for multi-disease mode) */}
      {queryMode !== 'multi' && (
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
      )}
      
            <div className="search-results" style={{ marginTop: '20px' }}>
              <SpaceLoader isLoading={loading}>
                {drugResults.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {drugResults.map((drug, index) => {
                const processedDrug = processDrugData(drug, queryMode);
                return (
                  <motion.div 
                    key={index}
                    className="space-card glow-effect"
                    whileHover={{ y: -5, boxShadow: '0 0 20px rgba(110, 59, 255, 0.6)' }}
                    whileTap={{ y: 0 }}
                    onClick={() => onDrugSelect(drug)}
                    style={{ 
                      cursor: 'pointer',
                      border: '1px solid var(--space-card-border)'
                    }}
                  >
                    {queryMode === 'drug' ? (
                      <>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FaAtom color="var(--space-accent)" /> {drug[0]}
                        </h3>
                        <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                          Generic: {drug[2]?.split(',').join(', ') || 'N/A'}
                        </p>
                        <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                          Treatment: {drug[3]?.split(',').join(', ') || 'N/A'}
                        </p>
                        <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                          Manufacturer: {drug[4] || 'Unknown'}
                        </p>
                      </>
                    ) : queryMode === 'disease' ? (
                      <>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FaAtom color="var(--space-accent)" /> {drug[2] || 'Unknown Disease'}
                        </h3>
                        <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                          Generic: {drug[1] || 'N/A'} (${drug[4] || 'N/A'})
                        </p>
                        <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                          Manufacturer: {drug[3] || 'Unknown'}
                        </p>
                        <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                          Brand Price: ${drug[5] || 'N/A'}
                        </p>
                      </>
                    ) : (
                      // Multi-disease mode
                      <>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FaDna color="var(--space-accent)" /> {drug[0]}
                        </h3>
                        <div style={{ 
                          display: 'inline-block',
                          padding: '3px 8px', 
                          backgroundColor: 'rgba(110, 59, 255, 0.2)', 
                          borderRadius: '4px',
                          color: 'var(--space-accent)',
                          fontWeight: 'bold',
                          marginBottom: '10px'
                        }}>
                          Treats {drug[2]} diseases
                        </div>
                        <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                          Conditions: {drug[3]?.split(',').join(', ') || 'N/A'}
                        </p>
                        <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                          Manufacturer: {drug[4] || 'Unknown'}
                        </p>
                        <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                          Price: ${drug[5] || 'N/A'}
                        </p>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
            
            {/* Pagination Controls */}
            <PaginationControls 
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              hasPrevPage={lastId > 0}
              hasNextPage={hasMoreResults}
            />
          </>
                ) : queryMode === 'multi' ? (
          <div className="space-card" style={{ textAlign: 'center', padding: '30px' }}>
            <p>No multi-disease treatments found. Try adjusting the minimum diseases threshold.</p>
          </div>
                ) : searchTerm.trim() !== '' ? (
          <div className="space-card" style={{ textAlign: 'center', padding: '30px' }}>
            <p>No drugs found in this sector of the galaxy. Try a different search term.</p>
          </div>
                ) : (
          <div className="space-card" style={{ textAlign: 'center', padding: '30px' }}>
            <p>Enter a search term to explore the cosmic drug database.</p>
          </div>
                )}
              </SpaceLoader>
      </div>
    </div>
  );
};

export default DrugSearch;
