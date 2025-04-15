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
  // For multi-disease mode, we don't need a search term
  if (mode !== 'multi' && !searchTerm.trim()) {
    console.log('Empty search term, returning empty results');
    return [];
  }

  try {
    let endpoint;
    
    // Ensure we have a valid search term for drug and disease modes
    const safeSearchTerm = searchTerm.trim() || 'a'; // Use 'a' as a fallback to get some results
    
    if (mode === 'drug') {
      endpoint = `${BASE_URL}/Drug_Search/${lastId}/${encodeURIComponent(safeSearchTerm)}`;
    } else if (mode === 'disease') {
      endpoint = `${BASE_URL}/Disease_Search/${lastId}/${encodeURIComponent(safeSearchTerm)}`;
    } else if (mode === 'multi') {
      // For multi-disease mode, we use the minDiseases parameter
      endpoint = `${BASE_URL}/Multi_Disease_Treatment/${lastId}/${minDiseases}`;
    } else {
      console.error(`Invalid mode: ${mode}`);
      return [];
    }
    
    console.log(`Fetching data from: ${endpoint}`);
    
    // Use a simple GET request without extra headers that might cause CORS issues
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} - ${response.statusText}`);
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    
    if (!data || !data.data) {
      console.warn('API response missing data property:', data);
      return [];
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return an empty array on error to prevent UI crashes
    return [];
  }
};
