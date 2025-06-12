// NotFoundPage.jsx
import React from 'react';

const NotFoundPage = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem',
      color: '#1f2937',
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404 - Página não encontrada</h1>
      <p style={{ fontSize: '1.25rem' }}>
        A página que você está procurando não existe ou foi movida.
      </p>
    </div>
  );
};

export default NotFoundPage;
