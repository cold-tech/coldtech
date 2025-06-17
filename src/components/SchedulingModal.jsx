import React, { useState, useEffect } from 'react';
import databaseService from '../services/databaseService';

function SchedulingModal({ closeModal }) {
  const [formData, setFormData] = useState({
    cliente: '',
    contato: '',
    servico: 'manutenção preventiva',
    data: '',
    time: '',
    local: '',
    status: 'pendente'
  });
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Carregar serviços disponíveis
    const loadServicos = async () => {
      const servicosData = await databaseService.getServicos();
      setServicos(servicosData);
    };
    
    loadServicos();
    
    // Definir a data para o dia seguinte por padrão
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      data: tomorrow.toISOString().split('T')[0]
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validar campos obrigatórios
      if (!formData.cliente || !formData.contato || !formData.data || !formData.time || !formData.local) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }
      
      // Adicionar agendamento
      await databaseService.addAgendamento(formData);
      
      setSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao agendar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button 
          className="modal-close" 
          onClick={closeModal} 
          aria-label="Fechar Modal"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>
        
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1.5rem',
          color: '#2563eb',
          textAlign: 'center'
        }}>Solicitar Agendamento</h2>
        
        {success ? (
          <div className="success-message" style={{
            padding: '1rem',
            backgroundColor: '#dcfce7',
            borderRadius: '6px',
            marginBottom: '1rem',
            textAlign: 'center',
            color: '#166534'
          }}>
            <p>Agendamento solicitado com sucesso!</p>
            <p>Nossa equipe entrará em contato para confirmar.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message" style={{
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                borderRadius: '6px',
                marginBottom: '1rem',
                color: '#b91c1c'
              }}>
                {error}
              </div>
            )}
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="cliente" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Nome Completo *
              </label>
              <input 
                type="text" 
                id="cliente" 
                name="cliente" 
                value={formData.cliente}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="contato" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Telefone/WhatsApp *
              </label>
              <input 
                type="tel" 
                id="contato" 
                name="contato" 
                value={formData.contato}
                onChange={handleChange}
                required
                placeholder="(00) 00000-0000"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="servico" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Tipo de Serviço *
              </label>
              <select 
                id="servico" 
                name="servico" 
                value={formData.servico}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                {servicos.map(servico => (
                  <option key={servico.id} value={servico.tipo}>
                    {servico.tipo}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="data" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Data Desejada *
                </label>
                <input 
                  type="date" 
                  id="data" 
                  name="data" 
                  value={formData.data}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="time" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Horário Preferido *
                </label>
                <input 
                  type="time" 
                  id="time" 
                  name="time" 
                  value={formData.time}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="local" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Endereço Completo *
              </label>
              <textarea 
                id="local" 
                name="local" 
                value={formData.local}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Rua, número, bairro, cidade"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              ></textarea>
            </div>
            
            <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                type="button" 
                onClick={closeModal}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#f3f4f6',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Enviando...' : 'Solicitar Agendamento'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SchedulingModal;