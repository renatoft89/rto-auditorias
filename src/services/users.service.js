const UsuarioModel = require('../models/Usuarios.Model')

const cadastrarUsuario = async (dados) => {
  if (!dados.nome || !dados.email || !dados.cpf || !dados.tipo_usuario) {
    throw new Error('Dados obrigatórios faltando');
  }

  const existeUsuario = await UsuarioModel.verificaUsuarioExistente(dados);
  if (existeUsuario) {
    throw new Error('CPF ou Email já cadastrado');
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
