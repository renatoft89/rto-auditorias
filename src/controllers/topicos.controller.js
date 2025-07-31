const TopicoService = require('../services/topicos.service');

const cadastrar = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: 'ID do cliente é obrigatório.' });
  }

  const dados = { ...req.body, usuario_id: Number(id) };
  try {
    const novoTopico = await TopicoService.cadastrarTopico(dados);
    return res.status(201).json(novoTopico);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrar
};