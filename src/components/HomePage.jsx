import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import CTASection from './CTASection';
import Footer from './Footer';

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default HomePage;