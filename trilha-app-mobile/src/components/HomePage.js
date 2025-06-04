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

      <section className="about-app-card card">
        <h2>Sobre o App</h2>
        <p className="justified-text">
          O TrilhaApp foi desenvolvido especificamente para enriquecer sua experiência na Trilha das Árvores da ESALQ, tornando-a mais <strong>acessível e imersiva</strong>. Com ele, você pode descobrir informações fascinantes sobre as diversas espécies de árvores, ouvir audioguias detalhados que aprofundam seu conhecimento e interagir com nosso chatbot inteligente para tirar suas dúvidas em tempo real.
        </p>
      </section>

      <section className="features-preview card">
        <h2>Funcionalidades Principais</h2>
        <ul>
          <li>🗺️ <strong>Mapas interativos</strong> das trilhas para facilitar a navegação e a localização das árvores.</li>
          <li>🌳 <strong>Informações detalhadas</strong> sobre cada espécie de árvore, acessíveis diretamente do seu dispositivo.</li>
          <li>🔊 <strong>Audioguias</strong> para uma experiência imersiva, oferecendo narrações informativas enquanto você explora.</li>
          <li>🤖 <strong>Chatbot</strong> inteligente para tirar suas dúvidas em tempo real e fornecer detalhes adicionais sobre as árvores.</li>
          <li>📱 <strong>Interface amigável e acessível</strong>, desenvolvida para garantir uma navegação intuitiva e agradável para todos os usuários.</li>
        </ul>
      </section>

      <section className="intro-section card">
        <h2>Descrição do Projeto</h2>
        <p className="justified-text spaced-paragraph">
          O <strong>TrilhaApp</strong> é uma solução inovadora projetada para aprimorar a experiência de aprendizado e exploração na <strong>Trilha das Árvores da ESALQ</strong>. Nosso principal objetivo é transformar a visita a essa trilha em uma <strong>jornada imersiva e interativa</strong>, proporcionando acesso fácil e instantâneo a um vasto universo de conhecimento sobre a flora local.
        </p>
        <br/><p className="justified-text spaced-paragraph">
          Em um mundo onde a conexão com a natureza é cada vez mais valorizada, mas o acesso a informações detalhadas nem sempre é imediato, o TrilhaApp atua como uma <strong>ponte essencial</strong>. Ele <strong>democratiza o conhecimento</strong> sobre as diversas espécies de árvores, permitindo que visitantes de todas as idades e níveis de conhecimento possam <strong>descobrir, aprender e se engajar</strong> com a rica biodiversidade da ESALQ de maneira divertida e acessível. Acreditamos firmemente que, ao oferecer ferramentas como <strong>audioguias</strong> e um <strong>chatbot interativo</strong>, estimulamos a curiosidade e o respeito pelo meio ambiente, contribuindo para uma <strong>experiência educativa verdadeiramente inesquecível</strong>.
        </p>
      </section>
    </div>
  );
}

export default HomePage;