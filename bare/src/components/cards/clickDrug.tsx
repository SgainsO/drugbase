import React from 'react';
import Button from 'react-bootstrap/Button';
import { Drug } from '../CardTypes';

type Props = Drug;

const DrugInfoCard: React.FC<Props> = ({
  name,
  drugID,
  genID,
  diseases,
  gPrice,
  dPrice
}) => {
  return (
    <div className="drug-info-card">
      <h3>{name}</h3>
      <p><strong>Drug ID:</strong> {drugID}</p>
      <p><strong>Generic ID:</strong> {genID}</p>
      <p><strong>Associated Diseases ({diseases.length}):</strong> {diseases}</p>
      <p><strong>Generic Price:</strong> ${gPrice.toFixed(2)}</p>
      <p><strong>Drug Price:</strong> ${dPrice.toFixed(2)}</p>
      <Button variant="primary">Show Graph</Button>
    </div>
  );
};

export default DrugInfoCard;
