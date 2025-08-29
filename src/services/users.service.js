const UsuarioModel = require('../models/Usuarios.Model')
// Add this line at the top of your file
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (novoUsuario) => {
  const { nome, email, cpf, tipo_usuario, senha } = novoUsuario;
  
  if (!nome || !email || !cpf || !tipo_usuario || !senha) {
    throw new Error('Dados do usuário estão incompletos. Por favor, preencha todos os campos obrigatórios, incluindo a senha.');
  }

  const saltRounds = 8;
  const senhaHash = await bcrypt.hash(senha, saltRounds);

  const usuarioCompleto = {
    nome,
    email,
    cpf,
    tipo_usuario,
    senha: senhaHash,
  };

  const usuarioJaExiste = await UsuarioModel.verificaUsuarioExistente(usuarioCompleto);
  if (usuarioJaExiste) {
    throw new Error('Erro: CPF ou e-mail já cadastrado. Tente novamente com outros dados.');
  }

  const novoUsuarioId = await UsuarioModel.cadastrarUsuario(usuarioCompleto);

  const { senha: senhaOculta, ...usuarioRetorno } = usuarioCompleto;

  return {
    id: novoUsuarioId,
    ...usuarioRetorno,
  };
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
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '1d' }
    );

    const usuarioAutenticado = {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
      role: usuario.tipo_usuario,
      token,
    };

    return usuarioAutenticado;

  } catch (err) {
    console.error('Erro na autenticação:', err);
    return { erro: 'Erro interno do servidor.' };
  }
};

module.exports = {
  cadastrarUsuario,
  autenticarUsuario
};
