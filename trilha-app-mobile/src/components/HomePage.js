import React from 'react';
import { Link } from 'react-router-dom';
import './../App.css'; // Assuming App.css is in src

function HomePage() {
  return (
    <div className="page-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Bem-vindo ao TrilhaApp!</h1>
          <p>Explore a rica biodiversidade da ESALQ de uma forma interativa e educativa.</p>
          <Link to="/trilhas" className="btn btn-primary">Descobrir Trilhas</Link>
        </div>
      </header>

      <section className="intro-section card">
        <h2>Sobre o App</h2>
        <p>
          O TrilhaApp foi desenvolvido para enriquecer sua experiência na Trilha das Árvores da ESALQ, tornando-a mais acessível e imersiva.
          Descubra informações fascinantes sobre as espécies de árvores, ouça audioguias e interaja com nosso chatbot para aprender mais.
        </p>
      </section>

      <section className="features-preview card">
        <h2>Funcionalidades Principais</h2>
        <ul>
          <li>🗺️ Mapas interativos das trilhas</li>
          <li>🌳 Informações detalhadas sobre as árvores</li>
          <li>🔊 Audioguias para uma experiência imersiva</li>
          <li>🤖 Chatbot para tirar suas dúvidas</li>
          <li>📱 Interface amigável e acessível</li>
        </ul>
      </section>
    </div>
  );
}

export default HomePage;