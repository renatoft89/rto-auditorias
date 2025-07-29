'use strict';
const UsuarioModel = require('../models/Users.Model')

const cadastrarUsuario = async (dados) => {
  if (!dados.nome || !dados.email || !dados.cpf || !dados.tipo_usuario) {
    throw new Error('Dados obrigatórios faltando');
  }

  const novoUsuarioId = await UsuarioModel.cadastrarUsuario(dados);
  
  return {
    id: novoUsuarioId,
    ...dados
  };
};

module.exports = {
  cadastrarUsuario
};
