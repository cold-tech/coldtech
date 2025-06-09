import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <a href="#main-content" className="logo">
          <img src="../src/assets/logo.svg" alt="ColdTech Logo" />
          <span className="logo-text">ColdTech</span>
        </a>
        <ul className="navbar-links">
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#cta">Contato</a></li>
          <li><Link to="/agenda" className="agenda-btn">Agenda</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;