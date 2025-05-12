import React from 'react';
import { Link } from 'react-router-dom';
import './../App.css'; 

// Dados de exemplo para as trilhas - idealmente viriam de uma API ou estado global
const trailsData = [
  { id: 1, name: "Trilha das Gigantes", description: "Descubra as árvores mais antigas e imponentes da ESALQ.", distance: "2.5 km", qrCodes: 7, image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJlJTIwdHJhaWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" },
  { id: 2, name: "Trilha das Flores Nativas", description: "Um percurso colorido pelas espécies floríferas locais.", distance: "1.8 km", qrCodes: 10, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmF0dXJlJTIwdHJhaWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" },
  { id: 3, name: "Trilha do Pequeno Explorador", description: "Ideal para crianças e famílias, com foco em curiosidades.", distance: "1.2 km", qrCodes: 5, image: "https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5hdHVyZSUyMHRyYWlsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" },
];

function TrailsListPage() {
  return (
    <div className="page-container">
      <h2 className="page-title">Trilhas Disponíveis</h2>
      <p className="page-subtitle">Escolha uma trilha para iniciar sua jornada de descobertas pela ESALQ.</p>
      <div className="trails-list">
        {trailsData.map(trail => (
          <Link to={`/trilha/${trail.id}`} key={trail.id} className="trail-card-link">
            <div className="trail-card card">
              <img src={trail.image} alt={trail.name} className="trail-card-image" />
              <div className="trail-card-content">
                <h3>{trail.name}</h3>
                <p className="trail-card-description">{trail.description}</p>
                <div className="trail-card-details">
                  <span>📍 {trail.distance}</span>
                  <span>🌳 {trail.qrCodes} QR Codes</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TrailsListPage;