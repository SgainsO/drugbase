// Data processing utilities for DrugBase

// Sample data for charts
export const sampleYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
export const sampleEffectiveness = [65, 70, 75, 78, 82, 85, 88];
export const sampleSideEffects = [20, 18, 15, 14, 12, 10, 8];

/**
 * Process drug data for display
 * @param {Array} drugData - Raw drug data from the API
 * @param {string} queryMode - The search mode ('drug', 'disease', or 'multi')
 * @returns {Object} - Processed drug data
 */
export const processDrugData = (drugData, queryMode) => {
  // Default values in case data format doesn't match expectations
  if (!drugData || !Array.isArray(drugData)) {
    return {
      id: 0,
      name: 'Unknown Drug',
      genericName: 'N/A',
      treatment: ['N/A'],
      manufacturer: 'Unknown',
      price: 0,
      genericPrice: 0,
      effectiveness: sampleEffectiveness,
      sideEffects: sampleSideEffects,
      years: sampleYears,
      description: 'No data available for this drug.'
    };
  }

  if (queryMode === 'drug') {
    // Format: [Name, DrugID, GenericNames, DiseaseNames, ManufacturerName, generic_price, brand_price]
    return {
      id: drugData[1] || 0,
      name: drugData[0] || 'Unknown Drug',
      genericName: drugData[2]?.split(',').join(', ') || 'N/A',
      treatment: drugData[3]?.split(',') || ['N/A'],
      manufacturer: drugData[4] || 'Unknown',
      price: drugData[6] || 0,
      genericPrice: drugData[5] || 0,
      effectiveness: sampleEffectiveness,
      sideEffects: sampleSideEffects,
      years: sampleYears,
      description: `A pharmaceutical drug used to treat various conditions.`
    };
  } else if (queryMode === 'disease') {
    // Format: [DiseaseID, GenericName, DiseaseName, ManufacturerName, GenericPrice, BrandPrice]
    return {
      id: drugData[0] || 0,
      name: `Treatment for ${drugData[2] || 'Unknown Disease'}`,
      genericName: drugData[1] || 'N/A',
      treatment: [drugData[2] || 'N/A'],
      manufacturer: drugData[3] || 'Unknown',
      price: drugData[5] || 199.99,
      genericPrice: drugData[4] || 99.99,
      effectiveness: sampleEffectiveness,
      sideEffects: sampleSideEffects,
      years: sampleYears,
      description: `A treatment for ${drugData[2] || 'Unknown Disease'}.`
    };
  } else if (queryMode === 'multi') {
    // Format: [Name, DrugID, DiseaseCount, DiseaseNames, ManufacturerName, price]
    const diseaseCount = drugData[2] || 0;
    const diseaseNames = drugData[3]?.split(',') || ['Unknown'];
    
    return {
      id: drugData[1] || 0,
      name: drugData[0] || 'Unknown Drug',
      genericName: 'Multiple Generics',
      treatment: diseaseNames,
      manufacturer: drugData[4] || 'Unknown',
      price: drugData[5] || 0,
      genericPrice: Math.floor((drugData[5] || 0) * 0.6), // Estimate generic price as 60% of brand price
      effectiveness: sampleEffectiveness,
      sideEffects: sampleSideEffects,
      years: sampleYears,
      diseaseCount: diseaseCount,
      description: `A broad-spectrum pharmaceutical drug that treats ${diseaseCount} different conditions.`
    };
  }
  
  // Default fallback if queryMode is not recognized
  return {
    id: drugData[1] || 0,
    name: drugData[0] || 'Unknown Drug',
    genericName: 'N/A',
    treatment: ['N/A'],
    manufacturer: 'Unknown',
    price: 0,
    genericPrice: 0,
    effectiveness: sampleEffectiveness,
    sideEffects: sampleSideEffects,
    years: sampleYears,
    description: 'No data available for this drug.'
  };
};

/**
 * Get chart options for drug data visualization
 * @param {Object} selectedDrug - The selected drug data
 * @returns {Object} - Chart options
 */
export const getChartOptions = (selectedDrug) => {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: selectedDrug ? `${selectedDrug.name} Data Over Time` : '',
        color: 'white',
        font: {
          size: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(16, 20, 38, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(110, 59, 255, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };
};

/**
 * Get chart data for effectiveness visualization
 * @param {Object} selectedDrug - The selected drug data
 * @returns {Object} - Chart data
 */
export const getEffectivenessData = (selectedDrug) => {
  return {
    labels: selectedDrug?.years || [],
    datasets: [
      {
        label: 'Effectiveness (%)',
        data: selectedDrug?.effectiveness || [],
        borderColor: 'rgba(110, 59, 255, 1)',
        backgroundColor: 'rgba(110, 59, 255, 0.2)',
        pointBackgroundColor: 'rgba(110, 59, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(110, 59, 255, 1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
};

/**
 * Get chart data for side effects visualization
 * @param {Object} selectedDrug - The selected drug data
 * @returns {Object} - Chart data
 */
export const getSideEffectsData = (selectedDrug) => {
  return {
    labels: selectedDrug?.years || [],
    datasets: [
      {
        label: 'Side Effects (%)',
        data: selectedDrug?.sideEffects || [],
        borderColor: 'rgba(201, 97, 255, 1)',
        backgroundColor: 'rgba(201, 97, 255, 0.2)',
        pointBackgroundColor: 'rgba(201, 97, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(201, 97, 255, 1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
};

/**
 * Get price comparison data for visualization
 * @param {Object} selectedDrug - The selected drug data
 * @returns {Object} - Chart data
 */
export const getPriceComparisonData = (selectedDrug) => {
  return {
    labels: ['Price Comparison'],
    datasets: [
      {
        label: 'Brand Name Price',
        data: [selectedDrug?.price || 0],
        backgroundColor: 'rgba(110, 59, 255, 0.8)',
        borderColor: 'rgba(110, 59, 255, 1)',
        borderWidth: 1
      },
      {
        label: 'Generic Price',
        data: [selectedDrug?.genericPrice || 0],
        backgroundColor: 'rgba(201, 97, 255, 0.8)',
        borderColor: 'rgba(201, 97, 255, 1)',
        borderWidth: 1
      }
    ]
  };
};
