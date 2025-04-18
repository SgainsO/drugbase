import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DevPage() {
  const navigate = useNavigate();
  const [manufacturers, setManufacturers] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [generics, setGenerics] = useState([]);
  const [formData, setFormData] = useState({
    drugName: '',
    drugPrice: '',
    drugPurpose: '',
    manufacturerId: '',
    genericName: '',
    genericPrice: '',
    genericPurpose: '',
    diseaseId: '',
    drugId: '',
    genId: ''
  });

  useEffect(() => {
    fetchManufacturers();
    fetchDiseases();
    fetchDrugs();
    fetchGenerics();
  }, []);

  const fetchDrugs = async () => {
    try {
      const response = await fetch('http://localhost:8000/dev/drugs');
      const data = await response.json();
      setDrugs(data.data);
    } catch (error) {
      console.error('Error fetching drugs:', error);
    }
  };

  const fetchGenerics = async () => {
    try {
      const response = await fetch('http://localhost:8000/dev/generics');
      const data = await response.json();
      setGenerics(data.data);
    } catch (error) {
      console.error('Error fetching generics:', error);
    }
  };

  const fetchManufacturers = async () => {
    try {
      const response = await fetch('http://localhost:8000/dev/manufacturers');
      const data = await response.json();
      setManufacturers(data.data);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    }
  };

  const fetchDiseases = async () => {
    try {
      const response = await fetch('http://localhost:8000/dev/diseases');
      const data = await response.json();
      setDiseases(data.data);
    } catch (error) {
      console.error('Error fetching diseases:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddManufacturer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/dev/manufacturer?name=' + formData.manufacturerName, {
        method: 'POST'
      });
      if (response.ok) {
        fetchManufacturers();
        setFormData(prev => ({ ...prev, manufacturerName: '' }));
      }
    } catch (error) {
      console.error('Error adding manufacturer:', error);
    }
  };

  const handleAddDrug = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/dev/drug?name=${formData.drugName}&price=${formData.drugPrice}&purpose=${formData.drugPurpose}&man_id=${formData.manufacturerId}`, {
        method: 'POST'
      });
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          drugName: '',
          drugPrice: '',
          drugPurpose: '',
          manufacturerId: ''
        }));
      }
    } catch (error) {
      console.error('Error adding drug:', error);
    }
  };

  const handleAddGeneric = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/dev/generic?name=${formData.genericName}&price=${formData.genericPrice}&purpose=${formData.genericPurpose}`, {
        method: 'POST'
      });
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          genericName: '',
          genericPrice: '',
          genericPurpose: ''
        }));
      }
    } catch (error) {
      console.error('Error adding generic:', error);
    }
  };

  const handleAddTreatment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/dev/treatment?disease_id=${formData.diseaseId}&drug_id=${formData.drugId}&gen_id=${formData.genId}`, {
        method: 'POST'
      });
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          diseaseId: '',
          drugId: '',
          genId: ''
        }));
      }
    } catch (error) {
      console.error('Error adding treatment:', error);
    }
  };

  return (
    <div className="dev-page">
      <h1>Developer Mode</h1>
      <button onClick={() => navigate('/')} className="back-button">Back to Main</button>

      <div className="dev-section">
        <h2>Add Manufacturer</h2>
        <form onSubmit={handleAddManufacturer}>
          <input
            type="text"
            name="manufacturerName"
            value={formData.manufacturerName}
            onChange={handleInputChange}
            placeholder="Manufacturer Name"
            required
          />
          <button type="submit">Add Manufacturer</button>
        </form>
      </div>

      <div className="dev-section">
        <h2>Add Drug</h2>
        <form onSubmit={handleAddDrug}>
          <input
            type="text"
            name="drugName"
            value={formData.drugName}
            onChange={handleInputChange}
            placeholder="Drug Name"
            required
          />
          <input
            type="number"
            name="drugPrice"
            value={formData.drugPrice}
            onChange={handleInputChange}
            placeholder="Price"
            required
          />
          <input
            type="text"
            name="drugPurpose"
            value={formData.drugPurpose}
            onChange={handleInputChange}
            placeholder="Purpose"
            required
          />
          <select
            name="manufacturerId"
            value={formData.manufacturerId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map(m => (
              <option key={m[0]} value={m[0]}>{m[1]}</option>
            ))}
          </select>
          <button type="submit">Add Drug</button>
        </form>
      </div>

      <div className="dev-section">
        <h2>Add Generic Drug</h2>
        <form onSubmit={handleAddGeneric}>
          <input
            type="text"
            name="genericName"
            value={formData.genericName}
            onChange={handleInputChange}
            placeholder="Generic Name"
            required
          />
          <input
            type="number"
            name="genericPrice"
            value={formData.genericPrice}
            onChange={handleInputChange}
            placeholder="Price"
            required
          />
          <input
            type="text"
            name="genericPurpose"
            value={formData.genericPurpose}
            onChange={handleInputChange}
            placeholder="Purpose"
            required
          />
          <button type="submit">Add Generic</button>
        </form>
      </div>

      <div className="dev-section">
        <h2>Update Manufacturer</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const response = await fetch(`http://localhost:8000/dev/manufacturer/${formData.updateManId}?new_name=${formData.updateManName}`, {
              method: 'PUT'
            });
            if (response.ok) {
              fetchManufacturers();
              setFormData(prev => ({
                ...prev,
                updateManId: '',
                updateManName: ''
              }));
            }
          } catch (error) {
            console.error('Error updating manufacturer:', error);
          }
        }}>
          <select
            name="updateManId"
            value={formData.updateManId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map(m => (
              <option key={m[0]} value={m[0]}>{m[1]}</option>
            ))}
          </select>
          <input
            type="text"
            name="updateManName"
            value={formData.updateManName}
            onChange={handleInputChange}
            placeholder="New Name"
            required
          />
          <button type="submit">Update Name</button>
        </form>
      </div>

      <div className="dev-section">
        <h2>Delete Drug</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (window.confirm('Are you sure? This will delete all related treatments and alternatives.')) {
            try {
              const response = await fetch(`http://localhost:8000/dev/drug/${formData.deleteDrugId}`, {
                method: 'DELETE'
              });
              if (response.ok) {
                fetchDrugs();
                setFormData(prev => ({
                  ...prev,
                  deleteDrugId: ''
                }));
              }
            } catch (error) {
              console.error('Error deleting drug:', error);
            }
          }
        }}>
          <select
            name="deleteDrugId"
            value={formData.deleteDrugId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Drug to Delete</option>
            {drugs.map(d => (
              <option key={d[0]} value={d[0]}>{d[1]} (ID: {d[0]})</option>
            ))}
          </select>
          <button type="submit" className="delete-button">Delete Drug</button>
        </form>
      </div>

      <div className="dev-section">
        <h2>Add Treatment</h2>
        <form onSubmit={handleAddTreatment}>
          <select
            name="diseaseId"
            value={formData.diseaseId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Disease</option>
            {diseases.map(d => (
              <option key={d[0]} value={d[0]}>{d[1]}</option>
            ))}
          </select>
          <select
            name="drugId"
            value={formData.drugId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Drug</option>
            {drugs.map(d => (
              <option key={d[0]} value={d[0]}>{d[1]} (ID: {d[0]})</option>
            ))}
          </select>
          <select
            name="genId"
            value={formData.genId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Generic Drug</option>
            {generics.map(g => (
              <option key={g[0]} value={g[0]}>{g[1]} (ID: {g[0]})</option>
            ))}
          </select>
          <button type="submit">Add Treatment</button>
        </form>
      </div>
    </div>
  );
}

export default DevPage;
