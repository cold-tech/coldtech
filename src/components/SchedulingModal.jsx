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
  const [availableTimes, setAvailableTimes] = useState([]);
  const [busyTimes, setBusyTimes] = useState([]);
  const [isCheckingTimes, setIsCheckingTimes] = useState(false);

  // Horários disponíveis para agendamento
  const allTimeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

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
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      data: tomorrowStr
    }));
  }, []);

  // Verificar horários disponíveis quando a data muda
  useEffect(() => {
    if (formData.data) {
      checkAvailableTimes(formData.data);
    }
  }, [formData.data]);

  // Função para verificar horários disponíveis
  const checkAvailableTimes = async (date) => {
    setIsCheckingTimes(true);
    setError('');
    
    try {
      // Limpar o horário selecionado ao mudar de data
      setFormData(prev => ({
        ...prev,
        time: ''
      }));
      
      // Buscar agendamentos existentes para a data selecionada
      const agendamentos = await databaseService.getAgendamentosByDate(date);
      
      // Extrair horários ocupados (garantindo formato consistente)
      const ocupados = agendamentos.map(agendamento => {
        // Normalizar formato do horário (remover segundos se existirem)
        let time = agendamento.time;
        if (time.includes(':')) {
          const parts = time.split(':');
          if (parts.length >= 2) {
            time = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
          }
        }
        return time;
      });
      
      console.log('Horários ocupados:', ocupados);
      setBusyTimes(ocupados);
      
      // Filtrar horários disponíveis
      const disponíveis = allTimeSlots.filter(time => !ocupados.includes(time));
      console.log('Horários disponíveis:', disponíveis);
      setAvailableTimes(disponíveis);
      
      // Se não houver horários disponíveis, mostrar mensagem
      if (disponíveis.length === 0) {
        setError(`Não há horários disponíveis para ${date}. Por favor, selecione outra data.`);
      }
    } catch (err) {
      console.error('Erro ao verificar horários disponíveis:', err);
      setError('Erro ao verificar horários disponíveis. Tente novamente.');
    } finally {
      setIsCheckingTimes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'data') {
      // Quando a data muda, resetamos o horário
      setFormData(prev => ({
        ...prev,
        [name]: value,
        time: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
      
      // Verificar novamente se o horário está disponível
      const currentAgendamentos = await databaseService.getAgendamentosByDate(formData.data);
      const currentBusyTimes = currentAgendamentos.map(a => a.time);
      
      if (currentBusyTimes.includes(formData.time)) {
        throw new Error('Este horário não está mais disponível. Por favor, selecione outro horário.');
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
                <select 
                  id="time" 
                  name="time" 
                  value={formData.time}
                  onChange={handleChange}
                  required
                  disabled={isCheckingTimes || availableTimes.length === 0}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    opacity: isCheckingTimes ? 0.7 : 1
                  }}
                >
                  <option value="">Selecione um horário</option>
                  {availableTimes.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {isCheckingTimes && (
                  <p style={{ color: '#2563eb', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Verificando horários disponíveis...
                  </p>
                )}
                {!isCheckingTimes && availableTimes.length === 0 && (
                  <p style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Não há horários disponíveis nesta data
                  </p>
                )}
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
                disabled={loading || isCheckingTimes || availableTimes.length === 0 || !formData.time}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: (loading || isCheckingTimes || availableTimes.length === 0 || !formData.time) ? 'not-allowed' : 'pointer',
                  opacity: (loading || isCheckingTimes || availableTimes.length === 0 || !formData.time) ? 0.7 : 1
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