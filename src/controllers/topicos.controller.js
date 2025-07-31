const TopicoService = require('../services/topicos.service');

const cadastrar = async (req, res) => {
  try {
    const novoTopico = await TopicoService.cadastrarTopico(req.body);
    return res.status(201).json(novoTopico);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrar
};