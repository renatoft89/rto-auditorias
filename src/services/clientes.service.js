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

module.exports = {
  cadastrarCliente
};