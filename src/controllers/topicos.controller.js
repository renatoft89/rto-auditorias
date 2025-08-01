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

const listar = async (req, res) => {
  try {
    const topicos = await TopicoService.listarTopicos();
    return res.status(200).json(topicos);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao listar tópicos.' });
  }
};

const editar = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  try {
    const topicoEditado = await TopicoService.editarTopico(id, dados);
    return res.status(200).json(topicoEditado);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const apagar = async (req, res) => {
  const { id } = req.params;
  console.log(`Apagando tópico com ID: ${id}`);
  
  try {
    return res.status(501).json({ mensagem: 'Método apagar tópico ainda não implementado.' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao apagar tópico.' });
  }
};

module.exports = {
  cadastrar,
  listar,
  editar,
  apagar
};