const PerguntasService = require('../services/perguntas.service');

const cadastrar = async (req, res) => {
  try {
    const novaPergunta = await PerguntasService.cadastrarPergunta(req.body);
    return res.status(201).json({ mensagem: 'Pergunta cadastrada com sucesso!', novaPergunta });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrar
};  