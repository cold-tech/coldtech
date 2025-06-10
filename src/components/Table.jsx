import React, { useState, useEffect } from "react";
import "./Table.css";
import agendamentosData from "../data/agendamentos.json";

// Ícones simples em SVG
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14"></path>
    <path d="M5 12h14"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

export default function Table() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    cliente: "",
    servico: "",
    data: "",
    time: "",
    local: "",
    status: "pendente",
  });

  // Carrega os dados do JSON ao iniciar
  useEffect(() => {
    setCompanies(agendamentosData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleAdd = () => {
    // Validação dos campos
    if (!form.cliente || !form.servico || !form.data || !form.time || !form.local) {
      alert("Preencha todos os campos!");
      return;
    }

    // Adiciona o novo agendamento no início da lista
    const newCompanies = [form, ...companies];
    setCompanies(newCompanies);
    
    // Limpa o formulário
    setForm({
      cliente: "",
      servico: "",
      data: "",
      time: "",
      local: "",
      status: "pendente"
    });

    // Opcional: Salvar no localStorage para persistência
    localStorage.setItem('agendamentos', JSON.stringify(newCompanies));
  };

  const handleDelete = (indexToDelete) => {
    const confirm = window.confirm("Tem certeza que deseja excluir?");
    if (!confirm) return;
    
    // Remove o item pelo índice
    const newCompanies = companies.filter((_, index) => index !== indexToDelete);
    setCompanies(newCompanies);
    
    // Opcional: Atualiza o localStorage
    localStorage.setItem('agendamentos', JSON.stringify(newCompanies));
  };

  const getStatusClass = (status) => {
    return status === "enviado" ? "status-enviado" : "status-pendente";
  };

  return (
    <div className="container">
      <h2 className="title">Agenda de Serviços</h2>
      
      {/* Formulário de Adição */}
      <div className="form-container">
        <h3 className="form-title">Adicionar Novo Agendamento</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Cliente</label>
            <input
              type="text"
              name="cliente"
              placeholder="Nome do cliente"
              value={form.cliente}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Serviço</label>
            <input
              type="text"
              name="servico"
              placeholder="Tipo de serviço"
              value={form.servico}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Horário</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Local</label>
            <input
              type="text"
              name="local"
              placeholder="Local do serviço"
              value={form.local}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group button-container">
            <button
              onClick={handleAdd}
              className="add-button"
              type="button"
            >
              <PlusIcon /> Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Data/Hora</th>
              <th>Local</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-message">
                  Nenhum agendamento encontrado
                </td>
              </tr>
            ) : (
              companies.map((item, index) => (
                <tr 
                  key={index} 
                  className={index % 2 === 0 ? "row-even" : "row-odd"}
                >
                  <td>
                    <div className="client-name">{item.cliente}</div>
                  </td>
                  <td>
                    <div className="service-name">{item.servico}</div>
                  </td>
                  <td>
                    <div className="date-time">
                      <CalendarIcon />
                      <span className="date">{formatDate(item.data)}</span>
                      <ClockIcon />
                      <span>{item.time}</span>
                    </div>
                  </td>
                  <td>
                    <div className="location">
                      <MapPinIcon />
                      <span>{item.local}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status ${getStatusClass(item.status)}`}>
                      <span className="status-dot"></span>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(index)}
                      className="delete-button"
                      title="Excluir"
                      type="button"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}