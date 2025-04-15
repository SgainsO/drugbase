// API utility functions for DrugBase

// Base URL for the API
const BASE_URL = 'http://localhost:8000';

/**
 * Fetch drug data from the API
 * @param {string} searchTerm - The search term
 * @param {number} lastId - The last ID for pagination
 * @param {string} mode - The search mode ('drug', 'disease', or 'multi')
 * @param {number} minDiseases - Minimum number of diseases for multi-disease mode
 * @returns {Promise<Array>} - The search results
 */
export const fetchDrugData = async (searchTerm, lastId, mode, minDiseases = 2) => {
  if (mode !== 'multi' && !searchTerm.trim()) {
    return [];
  }

  try {
    let endpoint;
    
    if (mode === 'drug') {
      endpoint = `${BASE_URL}/Drug_Search/${lastId}/${searchTerm}`;
    } else if (mode === 'disease') {
      endpoint = `${BASE_URL}/Disease_Search/${lastId}/${searchTerm}`;
    } else if (mode === 'multi') {
      // For multi-disease mode, we use the minDiseases parameter
      endpoint = `${BASE_URL}/Multi_Disease_Treatment/${lastId}/${minDiseases}`;
    }
    
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
