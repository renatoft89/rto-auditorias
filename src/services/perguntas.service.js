const PerguntasModel = require('../models/Perguntas.Model');

const cadastrarPergunta = async (pergunta) => {  
  if (!pergunta.id_topico || !pergunta.descricao_pergunta || !pergunta.ordem_pergunta) {
    throw new Error('Dados obrigatórios faltando');
  }

  const existePergunta = await PerguntasModel.verificaPerguntaExistente(pergunta);
  if (existePergunta) {
    throw new Error('Pergunta já cadastrada para este tópico');
  }

  const novoPerguntaId = await PerguntasModel.cadastrarPergunta(pergunta);
  
  return {
    id: novoPerguntaId,
    ...pergunta
  };
}

module.exports = {
  cadastrarPergunta
};