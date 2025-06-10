import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Agenda from "../pages/Agenda";
import HomePage from "../components/HomePage";
import Login from "../pages/Admin/Login";
import Dashboard from "../pages/Admin/Dashboard";
import PrivateRoute from "./PrivateRoute";
import DashboardHome from "../pages/Admin/components/DashboardHome";
import AgendamentosAdmin from "../pages/Admin/components/AgendamentosAdmin";
import ClientesAdmin from "../pages/Admin/components/ClientesAdmin";

const configuracoesStyle = {
  padding: '1rem',
  backgroundColor: 'white',
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const configTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '1rem',
  color: '#333'
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="agendamentos" element={<AgendamentosAdmin />} />
          <Route path="clientes" element={<ClientesAdmin />} />
          <Route path="configuracoes" element={
            <div style={configuracoesStyle}>
              <h2 style={configTitleStyle}>Configurações do Sistema</h2>
              <p style={{color: '#4b5563'}}>Aqui você poderá ajustar as configurações do sistema.</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}