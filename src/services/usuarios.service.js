const UsuarioModel = require('../models/Usuarios.Model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 8;

const listarTodosUsuarios = async () => {
  return UsuarioModel.listarUsuarios();
};

const buscarUsuarioPorId = async (id) => {
  const usuario = await UsuarioModel.buscarUsuarioPorId(id);
  if (!usuario) {
    throw new Error('Usuário não encontrado.');
  }
  return usuario;
};

const cadastrarUsuario = async (novoUsuario) => {
  const { nome, email, cpf, tipo_usuario, senha } = novoUsuario;
  if (!nome || !email || !cpf || !tipo_usuario || !senha) {
    throw new Error('Dados do usuário estão incompletos.');
  }

  const usuarioJaExiste = await UsuarioModel.verificaUsuarioExistente(email, cpf);
  if (usuarioJaExiste) {
    throw new Error('Erro: CPF ou e-mail já cadastrado.');
  }

  const senhaHash = await bcrypt.hash(senha, saltRounds);
  const novoUsuarioId = await UsuarioModel.cadastrarUsuario({ ...novoUsuario, senha: senhaHash });
  
  const { senha: _, ...usuarioRetorno } = novoUsuario;
  return { id: novoUsuarioId, ...usuarioRetorno };
};

const editarUsuario = async (id, dadosUsuario) => {
  const { nome, email, cpf, tipo_usuario } = dadosUsuario;
  if (!nome || !email || !cpf || !tipo_usuario) {
    throw new Error('Dados para edição estão incompletos.');
  }

  const usuarioExistente = await UsuarioModel.verificaUsuarioExistente(email, cpf, id);
  if (usuarioExistente) {
    throw new Error('CPF ou e-mail já pertence a outro usuário.');
  }

  const affectedRows = await UsuarioModel.editarUsuario(id, dadosUsuario);
  if (affectedRows === 0) {
    throw new Error('Usuário não encontrado ou não foi possível editar.');
  }
  return { id, ...dadosUsuario };
};

const alterarSenha = async (id, novaSenha) => {
  if (!novaSenha || novaSenha.length < 6) {
    throw new Error('A nova senha é obrigatória e deve ter pelo menos 6 caracteres.');
  }

  const senhaHash = await bcrypt.hash(novaSenha, saltRounds);
  const affectedRows = await UsuarioModel.alterarSenha(id, senhaHash);
  if (affectedRows === 0) {
    throw new Error('Usuário não encontrado ou não foi possível alterar a senha.');
  }
  return { mensagem: 'Senha alterada com sucesso.' };
};

const excluirUsuario = async (id) => {
  const affectedRows = await UsuarioModel.excluirUsuario(id);
  if (affectedRows === 0) {
    throw new Error('Usuário não encontrado ou não foi possível excluir.');
  }
  return { mensagem: 'Usuário excluído com sucesso.' };
};

const autenticarUsuario = async (email, senha) => {
  const error = { erro: 'E-mail ou senha incorretos.' };
  try {
    const usuario = await UsuarioModel.buscarUsuarioPorEmail(email);
    if (!usuario) {
      return error;
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return error;
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.tipo_usuario },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '1d' }
    );
    return {
      id: usuario.id,
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      role: usuario.tipo_usuario,
      token,
    };
  } catch (err) {
    console.error('Erro na autenticação:', err);
    return { erro: 'Erro interno do servidor.' };
  }
};

module.exports = {
  listarTodosUsuarios,
  buscarUsuarioPorId,
  cadastrarUsuario,
  editarUsuario,
  alterarSenha,
  excluirUsuario,
  autenticarUsuario,
};