import React from 'react';
import Button from 'react-bootstrap/Button';
import { Disease } from '../CardTypes';

type Props = Disease;

const MDrugInfoCard: React.FC<Props> = ({
  GenName,
  DiseaseID,
  Gprice,
  DrugPrice,
  drugID,
  DiseaseName,
  DrugName,
}) => {
  return (
    <div className="drug-info-card">
      <h3>{DiseaseName || 'Unknown Disease'}</h3>
      <p><strong>Generic:</strong> {GenName}</p>
      <p><strong>Drug:</strong> {DrugName || 'Unknown Drug'}</p>
      <p><strong>Generic Price:</strong> ${Gprice}</p>
      <p><strong>Drug Price:</strong> ${DrugPrice}</p>
    </div>
  );
};

export default MDrugInfoCard;
