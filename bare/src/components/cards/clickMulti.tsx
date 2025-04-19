import React from 'react';
import Button from 'react-bootstrap/Button';
import { Multi } from '../CardTypes';

type Props = Multi;
  
  const MDrugInfoCard: React.FC<Props> = ({
    name,
    drugID,
    countOfDiseases,
    diseaseNames,
    manufacturerNames,
    price,
  }) => {
    return (
      <div className="drug-info-card">
        <h3>{name}</h3>
        <p><strong>Drug ID:</strong> {drugID}</p>
        <p><strong>Associated Diseases ({countOfDiseases}):</strong> {diseaseNames}</p>
        <p><strong>Manufacturers:</strong> {manufacturerNames}</p>
        <p><strong>Price:</strong> ${price.toFixed(2)}</p>
      </div>
    );
  };
  
  export default MDrugInfoCard;