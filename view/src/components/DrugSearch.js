import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaAtom } from 'react-icons/fa';
import PaginationControls from './PaginationControls';
import SpaceLoader from './SpaceLoader';
import { fetchDrugData } from '../utils/api';
import { processDrugData } from '../utils/dataProcessing';

/**
 * Drug search component
 * @param {Object} props - Component props
 * @param {string} props.queryMode - The search mode ('drug' or 'disease')
 * @param {Function} props.onDrugSelect - Function to handle drug selection
 * @param {Function} props.onModeToggle - Function to handle mode toggle
 * @returns {JSX.Element} - Rendered component
 */
const DrugSearch = ({ queryMode, onDrugSelect, onModeToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drugResults, setDrugResults] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  // Fetch data from the API
  const fetchData = useCallback(async (resetPagination = false) => {
    if (searchTerm.trim() === '') {
      setDrugResults([]);
      setHasMoreResults(false);
      return;
    }

    const currentId = resetPagination ? 0 : lastId;
    
    try {
      setLoading(true);
      const results = await fetchDrugData(searchTerm, currentId, queryMode);
      
      if (resetPagination) {
        setDrugResults(results);
      } else {
        setDrugResults(prev => [...prev, ...results]);
      }
      
      // Update pagination state
      setHasMoreResults(results.length === 6); // If we got 6 results, there might be more
      
      // Update the last ID for pagination if we have results
      if (results.length > 0) {
        // For drug mode, the DrugID is at index 1
        // For disease mode, we need to find the max DrugID
        if (queryMode === 'drug') {
          const maxId = Math.max(...results.map(item => item[1]));
          setLastId(maxId);
        } else {
          // For disease mode, we need to find the max DrugID which isn't directly available
          // We'll use the last item's ID as the next starting point
          setLastId(results[results.length - 1][0]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, queryMode, lastId]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Reset pagination when search term changes
    setLastId(0);
    
    if (term.trim() === '') {
      setDrugResults([]);
      setHasMoreResults(false);
    }
  };

  // Fetch data when search term changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        fetchData(true); // Reset pagination when search term changes
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, queryMode, fetchData]);

  // Reset search when mode changes
  useEffect(() => {
    setSearchTerm('');
    setDrugResults([]);
    setLastId(0);
    setHasMoreResults(false);
  }, [queryMode]);

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
                    ) : (
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
