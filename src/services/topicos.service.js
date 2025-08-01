const TopicoModel = require('../models/Topicos.Model');

const cadastrarTopico = async (topico) => {
    
  if (!topico.nome_tema || !topico.observacao || !topico.requisitos || !topico.usuario_id) {
    throw new Error('Dados obrigatórios faltando');
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

const editarTopico = async (id, dados) => {
  if (!id || !dados.nome_tema || !dados.observacao || !dados.requisitos) {
    throw new Error('Dados obrigatórios faltando');
  } 
  const topicoEditado = await TopicoModel.editarTopico(id, dados);
  return topicoEditado;
};

module.exports = {
  cadastrarTopico,
  listarTopicos,
  editarTopico
};