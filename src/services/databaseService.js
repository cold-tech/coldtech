import supabase from './supabaseClient';
import databaseData from '../data/database.json';

// Classe para gerenciar o acesso aos dados
class DatabaseService {
  constructor() {
    // Inicializa o estado com os dados do JSON ou do localStorage
    this.initializeData();
  }

  // Inicializa os dados do sistema
  async initializeData() {
    try {
      // Verificar se já existem dados no Supabase
      const { data: agendamentos } = await supabase.from('agendamentos').select('*').limit(1);
      
      if (!agendamentos || agendamentos.length === 0) {
        // Se não houver dados, inicializar com os dados do JSON
        await this.initializeSupabaseData();
      }
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
      // Fallback para localStorage
      this.useFallbackData();
    }
  }

  // Inicializar dados no Supabase
  async initializeSupabaseData() {
    try {
      // Inserir serviços
      await supabase.from('servicos').insert(databaseData.servicos);
      
      // Inserir clientes
      await supabase.from('clientes').insert(databaseData.clientes.map(cliente => ({
        nome: cliente.nome,
        contato: cliente.contato,
        endereco: cliente.endereco
      })));
      
      // Obter clientes inseridos para referência
      const { data: clientesInseridos } = await supabase.from('clientes').select('*');
      const { data: servicosInseridos } = await supabase.from('servicos').select('*');
      
      // Mapear agendamentos com as referências corretas
      const agendamentosParaInserir = databaseData.agendamentos.map(agendamento => {
        const cliente = clientesInseridos.find(c => c.nome === agendamento.cliente);
        const servico = servicosInseridos.find(s => s.tipo === agendamento.servico);
        
        return {
          cliente_id: cliente?.id,
          servico_id: servico?.id,
          data: agendamento.data,
          time: agendamento.time,
          local: agendamento.local,
          status: agendamento.status
        };
      });
      
      // Inserir agendamentos
      await supabase.from('agendamentos').insert(agendamentosParaInserir);
    } catch (error) {
      console.error('Erro ao inicializar dados no Supabase:', error);
    }
  }

  // Usar dados do localStorage como fallback
  useFallbackData() {
    const savedData = localStorage.getItem('coldtech_database');
    if (savedData) {
      this.database = JSON.parse(savedData);
    } else {
      this.database = databaseData;
      this.saveToLocalStorage();
    }
  }

  // Salva os dados no localStorage (fallback)
  saveToLocalStorage() {
    localStorage.setItem('coldtech_database', JSON.stringify(this.database));
  }

  // AGENDAMENTOS
  async getAgendamentos() {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .order('data', { ascending: true });
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return data.map(item => ({
        id: item.id,
        cliente: item.clientes?.nome || '',
        contato: item.clientes?.contato || '',
        servico: item.servicos?.tipo || '',
        data: item.data,
        time: item.time,
        local: item.local,
        status: item.status
      }));
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      // Fallback para dados locais
      return this.database?.agendamentos || [];
    }
  }

  async getAgendamentosByDate(date) {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .eq('data', date)
        .order('time', { ascending: true });
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return data.map(item => ({
        id: item.id,
        cliente: item.clientes?.nome || '',
        contato: item.clientes?.contato || '',
        servico: item.servicos?.tipo || '',
        data: item.data,
        time: item.time,
        local: item.local,
        status: item.status
      }));
    } catch (error) {
      console.error('Erro ao buscar agendamentos por data:', error);
      // Fallback para dados locais
      return this.database?.agendamentos.filter(item => item.data === date) || [];
    }
  }

  async getAgendamentosPendentes() {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .eq('status', 'pendente')
        .order('data', { ascending: true });
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return data.map(item => ({
        id: item.id,
        cliente: item.clientes?.nome || '',
        contato: item.clientes?.contato || '',
        servico: item.servicos?.tipo || '',
        data: item.data,
        time: item.time,
        local: item.local,
        status: item.status
      }));
    } catch (error) {
      console.error('Erro ao buscar agendamentos pendentes:', error);
      // Fallback para dados locais
      return this.database?.agendamentos.filter(item => item.status === 'pendente') || [];
    }
  }

  async getAgendamentosConcluidos() {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .eq('status', 'concluido')
        .order('data', { ascending: true });
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return data.map(item => ({
        id: item.id,
        cliente: item.clientes?.nome || '',
        contato: item.clientes?.contato || '',
        servico: item.servicos?.tipo || '',
        data: item.data,
        time: item.time,
        local: item.local,
        status: item.status
      }));
    } catch (error) {
      console.error('Erro ao buscar agendamentos concluídos:', error);
      // Fallback para dados locais
      return this.database?.agendamentos.filter(item => item.status === 'concluido') || [];
    }
  }

  async addAgendamento(agendamento) {
    try {
      // Buscar ou criar cliente
      let cliente_id;
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('nome', agendamento.cliente)
        .single();
      
      if (clienteExistente) {
        cliente_id = clienteExistente.id;
      } else {
        const { data: novoCliente } = await supabase
          .from('clientes')
          .insert({
            nome: agendamento.cliente,
            contato: agendamento.contato,
            endereco: agendamento.local
          })
          .select('id')
          .single();
        
        cliente_id = novoCliente.id;
      }
      
      // Buscar serviço
      const { data: servico } = await supabase
        .from('servicos')
        .select('id')
        .eq('tipo', agendamento.servico)
        .single();
      
      // Inserir agendamento
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          cliente_id,
          servico_id: servico.id,
          data: agendamento.data,
          time: agendamento.time,
          local: agendamento.local,
          status: agendamento.status
        })
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .single();
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return {
        id: data.id,
        cliente: data.clientes?.nome || '',
        contato: data.clientes?.contato || '',
        servico: data.servicos?.tipo || '',
        data: data.data,
        time: data.time,
        local: data.local,
        status: data.status
      };
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      // Fallback para dados locais
      if (this.database?.agendamentos) {
        this.database.agendamentos.unshift(agendamento);
        this.saveToLocalStorage();
      }
      return agendamento;
    }
  }

  async updateAgendamento(index, agendamento) {
    try {
      if (!agendamento.id) {
        throw new Error('ID do agendamento não fornecido');
      }
      
      // Buscar ou criar cliente
      let cliente_id;
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('nome', agendamento.cliente)
        .single();
      
      if (clienteExistente) {
        cliente_id = clienteExistente.id;
      } else {
        const { data: novoCliente } = await supabase
          .from('clientes')
          .insert({
            nome: agendamento.cliente,
            contato: agendamento.contato,
            endereco: agendamento.local
          })
          .select('id')
          .single();
        
        cliente_id = novoCliente.id;
      }
      
      // Buscar serviço
      const { data: servico } = await supabase
        .from('servicos')
        .select('id')
        .eq('tipo', agendamento.servico)
        .single();
      
      // Atualizar agendamento
      const { data, error } = await supabase
        .from('agendamentos')
        .update({
          cliente_id,
          servico_id: servico.id,
          data: agendamento.data,
          time: agendamento.time,
          local: agendamento.local,
          status: agendamento.status
        })
        .eq('id', agendamento.id)
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .single();
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return {
        id: data.id,
        cliente: data.clientes?.nome || '',
        contato: data.clientes?.contato || '',
        servico: data.servicos?.tipo || '',
        data: data.data,
        time: data.time,
        local: data.local,
        status: data.status
      };
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      // Fallback para dados locais
      if (this.database?.agendamentos && index !== undefined) {
        this.database.agendamentos[index] = agendamento;
        this.saveToLocalStorage();
      }
      return agendamento;
    }
  }

  async deleteAgendamento(index, id) {
    try {
      if (id) {
        const { error } = await supabase
          .from('agendamentos')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      } else {
        throw new Error('ID do agendamento não fornecido');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      // Fallback para dados locais
      if (this.database?.agendamentos && index !== undefined) {
        const removed = this.database.agendamentos.splice(index, 1);
        this.saveToLocalStorage();
        return removed[0];
      }
      return null;
    }
  }

  // CLIENTES
  async getClientes() {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return this.database?.clientes || [];
    }
  }

  // SERVIÇOS
  async getServicos() {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return this.database?.servicos || [];
    }
  }

  // Estatísticas
  async getEstatisticas() {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      
      // Contar total de agendamentos
      const { count: totalAgendamentos } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true });
      
      // Contar agendamentos pendentes
      const { count: pendentes } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');
      
      // Contar agendamentos concluídos
      const { count: concluidos } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'concluido');
      
      // Contar clientes únicos
      const { count: clientesUnicos } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true });
      
      // Contar agendamentos de hoje
      const { count: agendamentosHoje } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('data', hoje);
      
      return {
        totalAgendamentos: totalAgendamentos || 0,
        pendentes: pendentes || 0,
        concluidos: concluidos || 0,
        clientesUnicos: clientesUnicos || 0,
        agendamentosHoje: agendamentosHoje || 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      
      // Fallback para cálculo local
      const agendamentos = this.database?.agendamentos || [];
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
}

// Exporta uma instância única do serviço
const databaseService = new DatabaseService();
export default databaseService;