const AgendamentoModel = require('../models/Agendamentos.Model');
const ClienteModel = require('../models/Clientes.Model');
const UsuarioModel = require('../models/Usuarios.Model');

const agendarAuditoria = async (dados) => {
 
  if (!dados.cliente || !dados.usuario || !dados.data_auditoria) {
    throw new Error('Dados obrigatórios faltando.');
  }

  const clienteExiste = await ClienteModel.verificaClienteExistente(dados.cliente);
  if (!clienteExiste) {
    throw new Error('Cliente não encontrado.');
  }
  const usuarioExiste = await UsuarioModel.verificaUsuarioExistente(dados.usuario);
  
  if (!usuarioExiste) {
    throw new Error('Usuário não encontrado.');
  }

  const novoAgendamentoId = await AgendamentoModel.agendarAuditoria(dados);

  return {
    id: novoAgendamentoId,
    ...dados
  };
};

const listarAgendamentosFuturos = async () => {
  const agendamentos = await AgendamentoModel.buscarAgendamentosFuturos();
  return agendamentos;
};

const excluirAgendamento = async (id) => {
  if (!id) {
    throw new Error('ID do agendamento é obrigatório.');
  }
  
  const agendamentoExcluido = await AgendamentoModel.deletarAgendamentoPorId(id);
  if (agendamentoExcluido === 0) {
    throw new Error('Agendamento não encontrado ou não foi possível excluir.');
  }
  
  return { mensagem: 'Agendamento excluído com sucesso.' };
};

module.exports = {
  agendarAuditoria,
  listarAgendamentosFuturos,
  excluirAgendamento,
};