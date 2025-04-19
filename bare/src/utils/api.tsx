const BASE_URL = 'http://localhost:8000';

interface DrugData {
  // define the structure of each item returned from the API
  [key: string]: any; // placeholder, customize this as needed
}

/**
 * Fetch drug data from the API
 * @param searchTerm - the search term for drugs or diseases
 * @param lastId - pagination or starting ID
 * @param mode - one of 'drug', 'disease', or 'multi'
 * @param minDiseases - only used in 'multi' mode (defaults to 2)
 * @returns an array of DrugData objects
 */
export const fetchDrugData = async (
  searchTerm: string,
  lastId: string | number,
  mode: string,
  minDiseases: number = 2
): Promise<DrugData[]> => {
  console.log("Try this");

  if (mode !== 'multi' && !searchTerm.trim()) {
    console.log('Empty search term, returning empty results');
    return [];
  }
  console.log("Try this");

  try {
    let endpoint: string;
    const safeSearchTerm = searchTerm.trim() || 'a';

    console.log(mode)
    console.log(minDiseases)
    if (mode === 'drug') {
      endpoint = `${BASE_URL}/Drug_Search/${lastId}/${encodeURIComponent(safeSearchTerm)}`;
    } else if (mode === 'disease') {
      endpoint = `${BASE_URL}/Disease_Search/${lastId}/${encodeURIComponent(safeSearchTerm)}`;
    } else if (mode === 'multi') {
      endpoint = `${BASE_URL}/Multi_Disease_Treatment/${lastId}/${minDiseases}`;
    } else {
      console.error(`Invalid mode: ${mode}`);
      return [];
    }

    console.log(`Fetching data from: ${endpoint}`);
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
    return [];
  }
};
