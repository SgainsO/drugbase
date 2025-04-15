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
  const [userEnteredSearch, setUserEnteredSearch] = useState(false);

  // Fetch data from the API
  const fetchData = useCallback(async (resetPagination = false) => {
    // For non-multi modes, we need a search term (but the API will handle empty terms)
    if (queryMode !== 'multi' && searchTerm.trim() === '') {
      console.log('Empty search term in non-multi mode');
      // We'll still try to fetch some results with a default search term
    }

    const currentId = resetPagination ? 0 : lastId;
    
    try {
      setLoading(true);
      console.log(`Fetching data with searchTerm: "${searchTerm}", mode: ${queryMode}, lastId: ${currentId}`);
      
      const results = await fetchDrugData(searchTerm, currentId, queryMode, minDiseases);
      console.log(`Received ${results?.length || 0} results`);
      
      if (!results || results.length === 0) {
        console.log('No results returned from API');
        if (resetPagination) {
          setDrugResults([]);
        }
        setHasMoreResults(false);
      } else {
        if (resetPagination) {
          setDrugResults(results);
        } else {
          setDrugResults(prev => [...prev, ...results]);
        }
        
        // Update pagination state
        setHasMoreResults(results.length >= 6); // If we got 6 or more results, there might be more
        
        // Update the last ID for pagination if we have results
        if (results.length > 0) {
          try {
            // For all modes, the DrugID is at index 1
            const maxId = Math.max(...results.map(item => item[1] || 0));
            setLastId(maxId);
          } catch (error) {
            console.error('Error calculating maxId:', error);
            // If we can't calculate maxId, just use the current lastId + 1
            setLastId(currentId + 1);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Don't clear results on error to maintain current state
    } finally {
      setLoading(false);
    }
  }, [searchTerm, queryMode, lastId, minDiseases]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Mark that user has manually entered a search term
    setUserEnteredSearch(true);
    
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
    console.log(`Search term changed: "${searchTerm}", mode: ${queryMode}`);
    
    const timer = setTimeout(() => {
      if (queryMode === 'multi' || searchTerm.trim() !== '') {
        console.log(`Triggering search for: "${searchTerm}" in ${queryMode} mode`);
        fetchData(true); // Reset pagination when search parameters change
      }
    }, 300); // Reduced debounce time for more responsive search
    
    return () => clearTimeout(timer);
  }, [searchTerm, queryMode, minDiseases, fetchData]);

  // Use a ref to track the previous mode
  const prevModeRef = React.useRef(queryMode);
  
  // Reset search when mode changes
  useEffect(() => {
    // Skip if this is the initial render
    if (prevModeRef.current === queryMode) {
      return;
    }
    
    console.log(`Mode changed from ${prevModeRef.current} to ${queryMode}`);
    prevModeRef.current = queryMode;
    
    // Clear results when mode changes to prevent issues
    setDrugResults([]);
    setLastId(0);
    setHasMoreResults(false);
    
    // Special handling for multi-disease mode
    if (queryMode === 'multi') {
      // For multi-disease mode, we don't need a search term
      setSearchTerm('');
      
      // Use setTimeout to ensure fetchData is called after state updates
      setTimeout(() => {
        fetchData(true);
      }, 100);
    }
    
    // Special handling for drug mode
    if (queryMode === 'drug') {
      console.log('Transitioning to drug mode');
      
      // Only set default search term if user hasn't manually entered one
      if (!userEnteredSearch) {
        console.log('Setting default search term "a" for drug mode');
      }
      
      // Trigger a search with the current search term
      setTimeout(() => {
        fetchData(true);
      }, 100);
    }
    
    // Special handling for disease mode
    if (queryMode === 'disease') {
      console.log('Transitioning to disease mode');
      
      // Only set default search term if user hasn't manually entered one
      if (!userEnteredSearch) {
        console.log('Setting default search term "a" for disease mode');
      }
      
      // Trigger a search with the current search term
      setTimeout(() => {
        fetchData(true);
      }, 100);
    }
    
  }, [queryMode, fetchData]);
  
  // Safety check for mode toggle button
  const handleModeToggle = () => {
    // Clear results before toggling mode
    setDrugResults([]);
    setLastId(0);
    setHasMoreResults(false);
    
    // Reset the user entered search flag when toggling modes
    setUserEnteredSearch(false);
    
    // Call the parent's onModeToggle function
    onModeToggle();
  };

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
          onClick={handleModeToggle}
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
                try {
                  // Safely check if drug is valid before rendering
                  if (!drug || !Array.isArray(drug)) {
                    console.error('Invalid drug data:', drug);
                    return null;
                  }
                  
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
                            <FaAtom color="var(--space-accent)" /> {drug[0] || 'Unknown Drug'}
                          </h3>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Generic: {typeof drug[2] === 'string' ? drug[2].split(',').join(', ') : 'N/A'}
                          </p>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Treatment: {typeof drug[3] === 'string' ? drug[3].split(',').join(', ') : 'N/A'}
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
                            <FaDna color="var(--space-accent)" /> {drug[0] || 'Unknown Drug'}
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
                            Treats {drug[2] || '0'} diseases
                          </div>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Conditions: {typeof drug[3] === 'string' ? drug[3].split(',').join(', ') : 'N/A'}
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
                } catch (error) {
                  console.error('Error rendering drug card:', error, drug);
                  return null;
                }
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
