const UsuarioService = require('../services/usuarios.service');

const listar = async (_req, res) => {
  try {
    const usuarios = await UsuarioService.listarTodosUsuarios();
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioService.buscarUsuarioPorId(id);
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

const cadastrar = async (req, res) => {
  try {
    const novoUsuario = await UsuarioService.cadastrarUsuario(req.body);
    return res.status(201).json(novoUsuario);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const editar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEditado = await UsuarioService.editarUsuario(id, req.body);
    return res.status(200).json(usuarioEditado);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const alterarSenha = async (req, res) => {
  try {
    const { id } = req.params;
    const { novaSenha } = req.body;
    const resultado = await UsuarioService.alterarSenha(id, novaSenha);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const excluir = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await UsuarioService.excluirUsuario(id);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await UsuarioService.autenticarUsuario(email, senha);
    if (usuario.erro) {
      return res.status(401).json({ mensagem: usuario.erro });
    }
    return res.status(200).json({ usuario });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  listar,
  buscarPorId,
  cadastrar,
  editar,
  alterarSenha,
  excluir,
  login,
};