const TopicoModel = require('../models/Topicos.Model');

const cadastrarTopico = async (topico) => {
  if (!topico.nome_tema || !topico.requisitos || !topico.usuario_id) {
    throw new Error('Dados obrigatórios faltando');
  }

  const existeTopico = await TopicoModel.verificaTopicoExistente(topico.nome_tema);
  
  if (existeTopico) {
    throw new Error('Tópico já cadastrado');
  }

  const novoTopicoId = await TopicoModel.cadastrarTopico(topico);
  
  return {
    id: novoTopicoId,
    ...topico
  };
}

const listarTopicos = async () => {
  const topicos = await TopicoModel.listarTopicos();
  return topicos;
};

const listarTopicosComPerguntas = async () => {
  const topicosComPerguntas = await TopicoModel.listarTopicosComPerguntas();
  return topicosComPerguntas;
};

const editarTopico = async (id, dados) => {
  if (!id || !dados.nome_tema || !dados.requisitos) {
    throw new Error('Dados obrigatórios faltando');
  } 
  const topicoEditado = await TopicoModel.editarTopico(id, dados);
  return topicoEditado;
};

module.exports = {
  cadastrarTopico,
  listarTopicos,
  editarTopico,
  listarTopicosComPerguntas
};