const topicosService = require('../services/topicos.service');

const listarTopicosComPerguntas = async (req, res) => {
  try {
    const { status } = req.query;
    const topicos = await topicosService.listarTopicosComPerguntas(status);
    return res.status(200).json(topicos);
  } catch (error) {
    console.error('Erro no controller ao listar tópicos:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const cadastrarTopico = async (req, res) => {
  try {
    const result = await topicosService.cadastrarTopico(req.body, req.usuario);
    if (result.error) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error('Erro no controller ao cadastrar tópico:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const salvarTopicoEditado = async (req, res) => {
  try {
    const result = await topicosService.salvarTopicoEditado(req.body, req.usuario);
    if (result.error) {
        return res.status(result.statusCode).json({ message: result.message });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error('Erro no controller ao salvar nova versão do tópico:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await topicosService.atualizarStatus(id, req.body);
    if (result.error) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro no controller ao desativar tópico:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const excluirTopico = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await topicosService.excluirTopico(id);
    if (result.error) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro no controller ao excluir tópico:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  listarTopicosComPerguntas,
  cadastrarTopico,
  salvarTopicoEditado,
  atualizarStatus,
  excluirTopico,
};