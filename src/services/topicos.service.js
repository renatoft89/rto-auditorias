const TopicoModel = require('../models/Topicos.Model');

const cadastrarTopico = async (topico) => {

  console.log('topico', topico);
  
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

module.exports = {
  cadastrarTopico,
  listarTopicos
};