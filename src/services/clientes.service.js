'use strict';
const ClienteModel = require('../models/Clientes.Model');

const cadastrarCliente = async (dados) => {
  if (!dados.razao_social,  !dados.cnpj) {
    throw new Error('Dados obrigatórios faltando');
  }

  const novoClienteId = await ClienteModel.cadastrarCliente(dados);
  
  return {
    id: novoClienteId,
    ...dados
  };
};

const listarClientes = async () => {
  const clientes = await ClienteModel.listarClientes();
  if (!clientes || clientes.length === 0) {
    throw new Error('Nenhum cliente encontrado');
  }
  return clientes;
};

const editarCliente = async (id, dados) => {
  if (!id || !dados.razao_social || !dados.cnpj) {
    throw new Error('Dados obrigatórios faltando');
  }
  const linhasAfetadas = await ClienteModel.editarCliente(id, dados);
  if (linhasAfetadas === 0) {
    throw new Error('Cliente não encontrado ou não foi possível editar');
  }
  return {
    id,
    ...dados
  };
};

module.exports = {
  cadastrarCliente,
  listarClientes,
  editarCliente
};