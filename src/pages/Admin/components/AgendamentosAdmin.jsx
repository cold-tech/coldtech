import React from 'react';
import Table from '../../../components/Table';

export default function AgendamentosAdmin() {
  return (
    <div style={{padding: '1rem'}}>
      <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#333'}}>
        Gerenciamento de Agendamentos
      </h1>
      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <Table />
      </div>
    </div>
  );
}