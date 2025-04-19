import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [paginationHistory, setPaginationHistory] = useState([0]); // Track pagination history
  const [loading, setLoading] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [userEnteredSearch, setUserEnteredSearch] = useState(false);

  // Fetch data from the API - remove lastId from dependencies to prevent re-fetching
  const fetchData = useCallback(async (resetPagination = false, manualLastId = null) => {
    // For non-multi modes, we need a search term (but the API will handle empty terms)
    if (queryMode !== 'multi' && searchTerm.trim() === '') {
      console.log('Empty search term in non-multi mode');
      // We'll still try to fetch some results with a default search term
    }

    // Use the manually provided lastId if available, otherwise use state
    const currentId = resetPagination ? 0 : (manualLastId !== null ? manualLastId : lastId);
    
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
        // Always set results directly, don't append
        setDrugResults(results);
        
        // Update pagination state
        setHasMoreResults(results.length >= 6); // If we got 6 or more results, there might be more
        
        // Always update lastId with the maximum ID from the results
        if (results.length > 0) {
          try {
            // Get the correct index for the ID based on the mode
            const idIndex = queryMode === 'disease' ? 1 : 1; // DiseaseID is at index 1 in new format
            
            // Find the maximum ID in the results
            const maxId = Math.max(...results.map(item => {
              // Ensure we have a valid number
              const id = Number(item[idIndex]);
              return isNaN(id) ? 0 : id;
            }));
            
            console.log(`Setting lastId to ${maxId} (from index ${idIndex})`);
            
            // If this is a reset or initial load, reset the pagination history
            if (resetPagination) {
              setPaginationHistory([0, maxId]);
            } else {
              // Otherwise, add to the history
              setPaginationHistory(prev => [...prev, maxId]);
            }
            
            setLastId(maxId);
          } catch (error) {
            console.error('Error calculating maxId:', error, results);
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
  // Remove lastId from dependencies to prevent re-fetching when it changes
  }, [searchTerm, queryMode, minDiseases]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Mark that user has manually entered a search term
    setUserEnteredSearch(true);
    
    // Reset pagination when search term changes
    setLastId(0);
    setPaginationHistory([0]); // Reset pagination history
    
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
      setPaginationHistory([0]); // Reset pagination history
      setDrugResults([]);
      
      // Use setTimeout to ensure the minDiseases state is updated before fetching
      setTimeout(() => {
        fetchData(true);
      }, 100);
    }
  };

  // Fetch data when search term or minDiseases changes (with debounce)
  // Use a ref to track if this is an initial load to prevent double fetching
  const initialLoadRef = useRef(true);
  
  useEffect(() => {
    // Skip the initial render to prevent double fetching
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    
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
    setPaginationHistory([0]); // Reset pagination history
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
    setPaginationHistory([0]); // Reset pagination history
    setHasMoreResults(false);
    
    // Reset the user entered search flag when toggling modes
    setUserEnteredSearch(false);
    
    // Call the parent's onModeToggle function
    onModeToggle();
  };

  // Handle pagination - use direct API calls instead of fetchData to avoid state issues
  const handlePrevPage = () => {
    // If we have a pagination history, use it to go back
    if (paginationHistory.length > 1) {
      // Remove the current ID from history
      const newHistory = [...paginationHistory];
      newHistory.pop();
      
      // Get the previous ID from history
      const prevId = newHistory[newHistory.length - 1];
      
      console.log(`Going back to previous page with ID: ${prevId}`);
      
      // Clear current results and show loading
      setDrugResults([]);
      setLoading(true);
      
      // Make a direct API call to avoid state update issues
      fetchDrugData(searchTerm, prevId, queryMode, minDiseases)
        .then(results => {
          console.log(`Prev page received ${results?.length || 0} results`);
          
          if (!results || results.length === 0) {
            setHasMoreResults(false);
          } else {
            setDrugResults(results);
            setHasMoreResults(results.length >= 6);
            
            // Update the lastId to the previous ID
            setLastId(prevId);
            
            // Update pagination history
            setPaginationHistory(newHistory);
          }
        })
        .catch(error => {
          console.error('Error fetching prev page:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('No previous page available');
    }
  };

  const handleNextPage = () => {
    // Clear current results and show loading
    setDrugResults([]);
    setLoading(true);
    
    // Make a direct API call to avoid state update issues
    fetchDrugData(searchTerm, lastId, queryMode, minDiseases)
      .then(results => {
        console.log(`Next page received ${results?.length || 0} results`);
        
        if (!results || results.length === 0) {
          setHasMoreResults(false);
        } else {
          setDrugResults(results);
          setHasMoreResults(results.length >= 6);
          
          // Update lastId with the maximum ID from the results
          if (results.length > 0) {
            try {
              const idIndex = queryMode === 'disease' ? 1 : 1; // DiseaseID is at index 1 in new format
              const maxId = Math.max(...results.map(item => {
                const id = Number(item[idIndex]);
                return isNaN(id) ? 0 : id;
              }));
              console.log(`Next page setting lastId to ${maxId}`);
              
              // Add the current lastId to the pagination history before updating it
              setPaginationHistory(prev => [...prev, maxId]);
              
              // Update the lastId
              setLastId(maxId);
            } catch (error) {
              console.error('Error calculating maxId:', error);
              
              // If we can't calculate maxId, just use the current lastId + 1
              const newId = lastId + 1;
              setPaginationHistory(prev => [...prev, newId]);
              setLastId(newId);
            }
          }
        }
      })
      .catch(error => {
        console.error('Error fetching next page:', error);
      })
      .finally(() => {
        setLoading(false);
      });
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
                            Generic ID: {drug[2] || 'N/A'}
                          </p>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Treatment: {typeof drug[3] === 'string' ? drug[3].split(',').join(', ') : 'N/A'}
                          </p>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Generic Price: ${drug[4] || 'N/A'} | Brand Price: ${drug[5] || 'N/A'}
                          </p>
                        </>
                      ) : queryMode === 'disease' ? (
                        <>
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaAtom color="var(--space-accent)" /> {drug[5] || 'Unknown Disease'}
                          </h3>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Generic: {drug[0] || 'N/A'}
                          </p>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Drug: {drug[6] || 'N/A'}
                          </p>
                          <p style={{ color: 'var(--space-text-secondary)', marginBottom: '10px' }}>
                            Generic Price: ${drug[2] || 'N/A'} | Brand Price: ${drug[3] || 'N/A'}
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
              hasPrevPage={paginationHistory.length > 1} // Only enable prev button if we have history
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
