import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import agendamentosData from '../../../data/agendamentos.json';

// Componentes de ícones simples
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalAgendamentos: 0,
    pendentes: 0,
    concluidos: 0,
    clientesUnicos: 0
  });
  
  const [proximosAgendamentos, setProximosAgendamentos] = useState([]);

  useEffect(() => {
    // Calcular estatísticas
    const pendentes = agendamentosData.filter(item => item.status === 'pendente').length;
    const concluidos = agendamentosData.filter(item => item.status === 'enviado').length;
    
    // Obter clientes únicos
    const clientesUnicos = new Set(agendamentosData.map(item => item.cliente)).size;
    
    setStats({
      totalAgendamentos: agendamentosData.length,
      pendentes,
      concluidos,
      clientesUnicos
    });
    
    // Ordenar agendamentos por data (assumindo que as datas estão em formato ISO)
    const hoje = new Date();
    const proximos = agendamentosData
      .filter(item => new Date(item.data) >= hoje)
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .slice(0, 5); // Pegar os 5 próximos
      
    setProximosAgendamentos(proximos);
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  }

  return (
    <div className="p-4">
      <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#333'}}>Dashboard</h1>
      
      {/* Cards de estatísticas */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', borderLeft: '4px solid #3b82f6'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#3b82f6', marginRight: '1rem'}}>
              <CalendarIcon />
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Total de Agendamentos</p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{stats.totalAgendamentos}</p>
            </div>
          </div>
        </div>
        
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', borderLeft: '4px solid #f59e0b'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#fef3c7', color: '#f59e0b', marginRight: '1rem'}}>
              <ClockIcon />
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Pendentes</p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{stats.pendentes}</p>
            </div>
          </div>
        </div>
        
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', borderLeft: '4px solid #10b981'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#d1fae5', color: '#10b981', marginRight: '1rem'}}>
              <CheckIcon />
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Concluídos</p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{stats.concluidos}</p>
            </div>
          </div>
        </div>
        
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', borderLeft: '4px solid #8b5cf6'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#ede9fe', color: '#8b5cf6', marginRight: '1rem'}}>
              <UserIcon />
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Clientes</p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{stats.clientesUnicos}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Próximos agendamentos */}
      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem'}}>
        <div style={{borderBottom: '1px solid #e5e7eb', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{fontSize: '1.125rem', fontWeight: '600', color: '#333'}}>Próximos Agendamentos</h2>
          <Link to="/admin/agendamentos" style={{color: '#3b82f6', fontSize: '0.875rem', textDecoration: 'none'}}>
            Ver todos
          </Link>
        </div>
        
        <div style={{padding: '1rem'}}>
          {proximosAgendamentos.length === 0 ? (
            <p style={{color: '#6b7280', textAlign: 'center', padding: '1rem 0'}}>Nenhum agendamento próximo</p>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{backgroundColor: '#f9fafb'}}>
                    <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Cliente</th>
                    <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Serviço</th>
                    <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Data/Hora</th>
                    <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Local</th>
                    <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Status</th>
                  </tr>
                </thead>
                <tbody style={{borderTop: '1px solid #e5e7eb'}}>
                  {proximosAgendamentos.map((item, index) => (
                    <tr key={index} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>{item.cliente}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{item.servico}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        {formatDate(item.data)} às {item.time}
                      </td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{item.local}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem'}}>
                        <span style={{
                          padding: '0.25rem 0.5rem', 
                          display: 'inline-flex', 
                          fontSize: '0.75rem', 
                          lineHeight: '1.25rem', 
                          fontWeight: '600', 
                          borderRadius: '9999px',
                          backgroundColor: item.status === 'enviado' ? '#d1fae5' : '#fef3c7',
                          color: item.status === 'enviado' ? '#065f46' : '#92400e'
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Ações rápidas */}
      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{borderBottom: '1px solid #e5e7eb', padding: '0.75rem 1.5rem'}}>
          <h2 style={{fontSize: '1.125rem', fontWeight: '600', color: '#333'}}>Ações Rápidas</h2>
        </div>
        
        <div style={{padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}}>
          <Link to="/admin/agendamentos" style={{display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', textDecoration: 'none', transition: 'background-color 0.3s'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#3b82f6', marginRight: '1rem'}}>
              <CalendarIcon />
            </div>
            <div>
              <h3 style={{fontWeight: '500', color: '#333'}}>Novo Agendamento</h3>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Agendar um novo serviço</p>
            </div>
          </Link>
          
          <Link to="/admin/clientes" style={{display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f5f3ff', borderRadius: '0.5rem', textDecoration: 'none', transition: 'background-color 0.3s'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#ede9fe', color: '#8b5cf6', marginRight: '1rem'}}>
              <UserIcon />
            </div>
            <div>
              <h3 style={{fontWeight: '500', color: '#333'}}>Gerenciar Clientes</h3>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Visualizar e editar clientes</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}