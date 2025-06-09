import React from 'react';
import './HeroSection.css';

function HeroSection() {
  return (
    <header className="hero-section">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <h1 className="hero-title">ColdTech</h1>
        <p className="hero-subtitle">
          Especialistas em assistência técnica de ar-condicionado: Instalação, Manutenção e Projetos.
        </p>
        <a href="#servicos" className="hero-button">Conheça Nossos Serviços</a>
      </div>
    </header>
  );
}

export default HeroSection;