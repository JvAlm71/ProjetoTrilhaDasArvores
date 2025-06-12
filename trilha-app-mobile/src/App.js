import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import HomePage from './components/HomePage';
import TrailsListPage from './components/TrailsListPage';
import TrailDetailPage from './components/TrailDetailPage';
import ProjectInfoPage from './components/ProjectInfoPage';
import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-logo">TrilhaApp</Link>
          <ul className="nav-links">
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ''}>Início</NavLink></li>
            <li><NavLink to="/trilhas" className={({ isActive }) => isActive ? "active" : ''}>Trilhas</NavLink></li>
            <li><NavLink to="/sobre" className={({ isActive }) => isActive ? "active" : ''}>O Projeto</NavLink></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trilhas" element={<TrailsListPage />} />
            <Route path="/trilha/:id" element={<TrailDetailPage />} />
            <Route path="/sobre" element={<ProjectInfoPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} TrilhaApp - Equipe Lobo</p>
        </footer>
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;
