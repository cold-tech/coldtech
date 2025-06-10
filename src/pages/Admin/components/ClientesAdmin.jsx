import React, { useState, useEffect } from 'react';
import agendamentosData from '../../../data/agendamentos.json';

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Extrair clientes únicos dos agendamentos
    const clientesMap = {};
    
    agendamentosData.forEach(agendamento => {
      const cliente = agendamento.cliente;
      
      if (!clientesMap[cliente]) {
        clientesMap[cliente] = {
          nome: cliente,
          totalAgendamentos: 1,
          ultimoAgendamento: agendamento.data,
          ultimoServico: agendamento.servico,
          local: agendamento.local
        };
      } else {
        clientesMap[cliente].totalAgendamentos += 1;
        
        // Verificar se este agendamento é mais recente
        if (new Date(agendamento.data) > new Date(clientesMap[cliente].ultimoAgendamento)) {
          clientesMap[cliente].ultimoAgendamento = agendamento.data;
          clientesMap[cliente].ultimoServico = agendamento.servico;
        }
      }
    });
    
    // Converter o mapa em array
    setClientes(Object.values(clientesMap));
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  }

  return (
    <div style={{padding: '1rem'}}>
      <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#333'}}>
        Gerenciamento de Clientes
      </h1>
      
      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{padding: '1rem'}}>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{backgroundColor: '#f9fafb'}}>
                  <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Nome</th>
                  <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Total de Agendamentos</th>
                  <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Último Serviço</th>
                  <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Data</th>
                  <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Local</th>
                </tr>
              </thead>
              <tbody style={{borderTop: '1px solid #e5e7eb'}}>
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280'}}>
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                ) : (
                  clientes.map((cliente, index) => (
                    <tr key={index} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>{cliente.nome}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{cliente.totalAgendamentos}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{cliente.ultimoServico}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{formatDate(cliente.ultimoAgendamento)}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{cliente.local}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}