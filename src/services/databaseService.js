import databaseData from '../data/database.json';

// Classe para gerenciar o acesso aos dados
class DatabaseService {
  constructor() {
    // Inicializa o estado com os dados do JSON ou do localStorage
    this.initializeData();
  }

  // Inicializa os dados do sistema
  initializeData() {
    const savedData = localStorage.getItem('coldtech_database');
    if (savedData) {
      this.database = JSON.parse(savedData);
    } else {
      this.database = databaseData;
      this.saveToLocalStorage();
    }
  }

  // Salva os dados no localStorage
  saveToLocalStorage() {
    localStorage.setItem('coldtech_database', JSON.stringify(this.database));
  }

  // AGENDAMENTOS
  getAgendamentos() {
    return this.database.agendamentos;
  }

  getAgendamentosByDate(date) {
    return this.database.agendamentos.filter(item => item.data === date);
  }

  getAgendamentosPendentes() {
    return this.database.agendamentos.filter(item => item.status === 'pendente');
  }

  getAgendamentosConcluidos() {
    return this.database.agendamentos.filter(item => item.status === 'concluido');
  }

  addAgendamento(agendamento) {
    this.database.agendamentos.unshift(agendamento);
    this.saveToLocalStorage();
    return agendamento;
  }

  updateAgendamento(index, agendamento) {
    this.database.agendamentos[index] = agendamento;
    this.saveToLocalStorage();
    return agendamento;
  }

  deleteAgendamento(index) {
    const removed = this.database.agendamentos.splice(index, 1);
    this.saveToLocalStorage();
    return removed[0];
  }

  // CLIENTES
  getClientes() {
    return this.database.clientes;
  }

  getClienteById(id) {
    return this.database.clientes.find(cliente => cliente.id === id);
  }

  addCliente(cliente) {
    // Gerar novo ID
    const newId = Math.max(...this.database.clientes.map(c => c.id), 0) + 1;
    cliente.id = newId;
    cliente.historico = cliente.historico || [];
    
    this.database.clientes.push(cliente);
    this.saveToLocalStorage();
    return cliente;
  }

  updateCliente(id, clienteData) {
    const index = this.database.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.database.clientes[index] = { ...this.database.clientes[index], ...clienteData };
      this.saveToLocalStorage();
      return this.database.clientes[index];
    }
    return null;
  }

  // SERVIÇOS
  getServicos() {
    return this.database.servicos;
  }

  // USUÁRIOS
  getUsuarios() {
    return this.database.usuarios;
  }

  autenticarUsuario(email, senha) {
    return this.database.usuarios.find(
      user => user.email === email && user.senha === senha
    );
  }

  // CONFIGURAÇÕES
  getConfiguracoes() {
    return this.database.configuracoes;
  }

  updateConfiguracoes(configuracoes) {
    this.database.configuracoes = { ...this.database.configuracoes, ...configuracoes };
    this.saveToLocalStorage();
    return this.database.configuracoes;
  }

  // Estatísticas
  getEstatisticas() {
    const agendamentos = this.database.agendamentos;
    const hoje = new Date().toISOString().split('T')[0];
    
    return {
      totalAgendamentos: agendamentos.length,
      pendentes: agendamentos.filter(item => item.status === 'pendente').length,
      concluidos: agendamentos.filter(item => item.status === 'concluido').length,
      clientesUnicos: new Set(agendamentos.map(item => item.cliente)).size,
      agendamentosHoje: agendamentos.filter(item => item.data === hoje).length
    };
  }
}

// Exporta uma instância única do serviço
const databaseService = new DatabaseService();
export default databaseService;