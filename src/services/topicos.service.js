const TopicoModel = require('../models/Topicos.Model');

const cadastrarTopico = async (topico) => {
  if (!topico.nome_tema || !topico.observacao || !topico.usuario_id) {
    throw new Error('Dados obrigatórios faltando');
  }

  const novoTopicoId = await TopicoModel.cadastrarTopico(topico);
  
  return {
    id: novoTopicoId,
    ...topico
  };
}

module.exports = {
  cadastrarTopico
};