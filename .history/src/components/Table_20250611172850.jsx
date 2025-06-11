import React, { useState } from "react";
import { Trash2, Plus, Calendar, Clock, MapPin } from "lucide-react";
import "./Table.css";

const initialCompanies = [
  {
    cliente: "Gabriel",
    servico: "Manutenção",
    data: "2001-09-11",
    time: "19:20",
    local: "Eusébio",
    status: "enviado",
  },
  {
    cliente: "Pedro",
    servico: "Manutenção",
    data: "2001-09-11",
    time: "19:20",
    local: "Eusébio",
    status: "pendente",
  },
  {
    cliente: "Ana",
    servico: "Manutenção",
    data: "2001-09-11",
    time: "19:20",
    local: "Eusébio",
    status: "enviado",
  },
  {
    cliente: "Wilton",
    servico: "Manutenção",
    data: "2001-09-11",
    time: "19:20",
    local: "Eusébio",
    status: "pendente",
  },
];

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

export default function Table() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [form, setForm] = useState({
    cliente: "",
    servico: "",
    data: "",
    time: "",
    local: "",
    status: "pendente",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.cliente || !form.servico || !form.data || !form.time || !form.local) {
      alert("Preencha todos os campos!");
      return;
    }

    setCompanies([form, ...companies]);
    setForm({
      cliente: "",
      servico: "",
      data: "",
      time: "",
      local: "",
      status: "pendente"
    });
  };

  const handleDelete = (indexToDelete) => {
    const confirm = window.confirm("Tem certeza que deseja excluir?");
    if (!confirm) return;
    setCompanies(companies.filter((_, index) => index !== indexToDelete));
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
            >
              <Plus size={18} className="icon" /> Adicionar
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
                      <Calendar size={16} className="icon calendar-icon" />
                      <span className="date">{formatDate(item.data)}</span>
                      <Clock size={16} className="icon clock-icon" />
                      <span>{item.time}</span>
                    </div>
                  </td>
                  <td>
                    <div className="location">
                      <MapPin size={16} className="icon location-icon" />
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
                    >
                      <Trash2 size={16} />
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