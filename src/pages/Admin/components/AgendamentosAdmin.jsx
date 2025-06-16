import React, { useState, useEffect } from 'react';
import databaseService from '../../../services/databaseService';

export default function AgendamentosAdmin() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentAgendamento, setCurrentAgendamento] = useState({
    cliente: '',
    contato: '',
    servico: '',
    data: '',
    time: '',
    local: '',
    status: 'pendente'
  });
  const [servicos, setServicos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const agendamentosData = await databaseService.getAgendamentos();
        const servicosData = await databaseService.getServicos();
        setAgendamentos(agendamentosData);
        setServicos(servicosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAgendamento({
      ...currentAgendamento,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await databaseService.updateAgendamento(currentIndex, currentAgendamento);
        const updatedAgendamentos = [...agendamentos];
        updatedAgendamentos[currentIndex] = currentAgendamento;
        setAgendamentos(updatedAgendamentos);
      } else {
        const newAgendamento = await databaseService.addAgendamento(currentAgendamento);
        setAgendamentos([...agendamentos, newAgendamento]);
      }
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
    }
  };

  const handleEdit = (agendamento, index) => {
    setCurrentAgendamento(agendamento);
    setCurrentIndex(index);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id, index) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      try {
        await databaseService.deleteAgendamento(index, id);
        const updatedAgendamentos = agendamentos.filter((_, i) => i !== index);
        setAgendamentos(updatedAgendamentos);
      } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
      }
    }
  };

  const resetForm = () => {
    setCurrentAgendamento({
      cliente: '',
      contato: '',
      servico: '',
      data: '',
      time: '',
      local: '',
      status: 'pendente'
    });
    setIsEditing(false);
    setCurrentIndex(null);
    setShowModal(false);
  };

  return (
    <div>
      <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#333'}}>Agendamentos</h1>
      
      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h2 style={{fontSize: '1.25rem', fontWeight: '600'}}>Lista de Agendamentos</h2>
          <button 
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Novo Agendamento
          </button>
        </div>
        
        {loading ? (
          <div style={{textAlign: 'center', padding: '2rem 0'}}>
            <p>Carregando agendamentos...</p>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{backgroundColor: '#f9fafb'}}>
                  <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Cliente</th>
                  <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Data</th>
                  <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Horário</th>
                  <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Serviço</th>
                  <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Status</th>
                  <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Ações</th>
                </tr>
              </thead>
              <tbody style={{borderTop: '1px solid #e5e7eb'}}>
                {agendamentos.map((item, index) => (
                  <tr key={index} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>{item.cliente}</td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{item.time}</td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{item.servico}</td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem'}}>
                      <span style={{
                        padding: '0.25rem 0.5rem', 
                        display: 'inline-flex', 
                        fontSize: '0.75rem', 
                        lineHeight: '1.25rem', 
                        fontWeight: '600', 
                        borderRadius: '9999px',
                        backgroundColor: item.status === 'concluido' ? '#d1fae5' : '#fef3c7',
                        color: item.status === 'concluido' ? '#065f46' : '#92400e'
                      }}>
                        {item.status === 'concluido' ? 'Concluído' : 'Pendente'}
                      </span>
                    </td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem'}}>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button 
                          onClick={() => handleEdit(item, index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#eff6ff',
                            color: '#3b82f6',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>{isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
              <button 
                onClick={resetForm}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563'}}>
                  Cliente
                </label>
                <input
                  type="text"
                  name="cliente"
                  value={currentAgendamento.cliente}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563'}}>
                  Contato
                </label>
                <input
                  type="text"
                  name="contato"
                  value={currentAgendamento.contato}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563'}}>
                  Serviço
                </label>
                <select
                  name="servico"
                  value={currentAgendamento.servico}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map(servico => (
                    <option key={servico.id} value={servico.tipo}>
                      {servico.tipo}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563'}}>
                    Data
                  </label>
                  <input
                    type="date"
                    name="data"
                    value={currentAgendamento.data}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563'}}>
                    Horário
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={currentAgendamento.time}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563'}}>
                  Local
                </label>
                <input
                  type="text"
                  name="local"
                  value={currentAgendamento.local}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563'}}>
                  Status
                </label>
                <select
                  name="status"
                  value={currentAgendamento.status}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="pendente">Pendente</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem'}}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    color: '#4b5563',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {isEditing ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}