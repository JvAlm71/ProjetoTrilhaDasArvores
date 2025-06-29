import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './../App.css'; // Certifique-se de que este caminho está correto
import QrCodeScanner from './QrCodeScanner';

// Dados de exemplo para as trilhas
const trailsData = [
  {
    id: 1,
    name: "Trilha de Árvores Medicinais",
    description: "Explore espécies medicinais e conheça a diversidade botânica da ESALQ.",
    distance: "1.27 km",
    qrCodes: 21,
    image: "/esalq.jpg" 
  },
];

const TrailsListPage = () => {
  const [showQrScanner, setShowQrScanner] = useState(false);

  const navigateToTreePage = (qrData) => {
    console.log("Navegando com os dados do QR Code:", qrData);
    const trailId = parseInt(qrData, 10);
    const trail = trailsData.find((t) => t.id === trailId);

    if (trail) {
      window.location.href = `/trilha/${trail.id}`;
    } else {
      alert('QR Code não corresponde a nenhuma trilha conhecida.');
    }
  };

  const handleQrScan = (qrData) => {
    const trailId = parseInt(qrData, 10);
    const trail = trailsData.find((t) => t.id === trailId);
    if (trail) {
      window.location.href = `/trilha/${trail.id}`;
    } else {
      alert('QR Code não corresponde a nenhuma trilha conhecida.');
    }
    setShowQrScanner(false);
  };

  return (
    <div className="page-container">
      <div className="trails-header">
        <h1>Trilhas Disponíveis</h1>
        <button className="btn btn-scan-qr-large" onClick={() => setShowQrScanner(true)}>
          📱 Escanear QR Code de Trilha
        </button>
      </div>
      <QrCodeScanner active={showQrScanner} onScan={handleQrScan} onClose={() => setShowQrScanner(false)} />
      <ul className="trails-list">
        {trailsData.map((trail) => (
          <li key={trail.id} className="trail-item">
            <img src={trail.image} alt={trail.name} className="trail-image" />
            <div className="trail-info">
              <h2>{trail.name}</h2>
              <p>{trail.description}</p>
              <p><strong>Distância:</strong> {trail.distance}</p>
              <p><strong>QR Codes:</strong> {trail.qrCodes}</p>
              <Link to={`/trilha/${trail.id}`} className="btn btn-primary">Ver Detalhes</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrailsListPage;