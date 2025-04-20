import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Drug } from '../CardTypes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button } from 'react-bootstrap';

// Register chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = Drug;

const DrugInfoCard: React.FC<Props> = ({
  name,
  drugID,
  genID,
  diseases,
  gPrice,
  dPrice,
  gName
}) => {

  const [ShowGraph, ChangeGraph] = React.useState<boolean>(false);

  const chartData = {
    labels: [name, gName],
    datasets: [{
      label: 'Price Comparison',
      data: [dPrice, gPrice],
      backgroundColor: [
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
      <div className="drug-info-card">
        <h3>{name}</h3>
        <p><strong>Drug ID:</strong> {drugID}</p>
        <p><strong>Generic Alernative:</strong> {gName}</p>
        <p><strong>Associated Diseases ({diseases.length})</strong></p>
        <p><strong>Generic Price:</strong> ${gPrice.toFixed(2)}</p>
        <p><strong>Drug Price:</strong> ${dPrice.toFixed(2)}</p>
        <Button onClick={() => ChangeGraph(!ShowGraph)}>Show</Button>

      </div>
  
      <div style={{ marginLeft: '2rem' }}>
        {ShowGraph && (
          <div style={{ maxWidth: '600px', maxHeight: '600px', marginTop: '1rem'}}>
            <Bar data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugInfoCard;
