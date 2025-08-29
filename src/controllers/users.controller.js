const UsuarioService = require('../services/users.service');

const cadastrar = async (req, res) => {
  try {
    const novoUsuario = await UsuarioService.cadastrarUsuario(req.body);
    return res.status(201).json(novoUsuario);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;    

    const usuario = await UsuarioService.autenticarUsuario(email, senha);
    
    if (usuario.erro) {
      return res.status(400).json({ mensagem: usuario.erro })
    }

    return res.status(200).json({ usuario })

  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
};

module.exports = {
  cadastrar, 
  login
};