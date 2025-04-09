// API utility functions for DrugBase

// Base URL for the API
const BASE_URL = 'http://localhost:8000';

/**
 * Fetch drug data from the API
 * @param {string} searchTerm - The search term
 * @param {number} lastId - The last ID for pagination
 * @param {string} mode - The search mode ('drug' or 'disease')
 * @returns {Promise<Array>} - The search results
 */
export const fetchDrugData = async (searchTerm, lastId, mode) => {
  if (!searchTerm.trim()) {
    return [];
  }

  try {
    const endpoint = mode === 'drug' 
      ? `${BASE_URL}/Drug_Search/${lastId}/${searchTerm}`
      : `${BASE_URL}/Disease_Search/${lastId}/${searchTerm}`;
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
