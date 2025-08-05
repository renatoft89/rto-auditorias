const TopicoModel = require('../models/Topicos.Model');

<<<<<<< HEAD
const cadastrarTopico = async (topico) => {    
=======
const cadastrarTopico = async (topico) => {
  console.log('Iniciando o cadastro de tópico:', topico);
  
    
>>>>>>> d9c59b5bc76ae5e47f9a9ec2ba94abb59f5bf335
  if (!topico.nome_tema || !topico.observacao || !topico.requisitos || !topico.usuario_id) {
    throw new Error('Dados obrigatórios faltando');
  }

  const existeTopico = await TopicoModel.verificaTopicoExistente(topico.nome_tema);
  console.log(`Verificando se o tópico existe: ${existeTopico}`);
  
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
  if (!id || !dados.nome_tema || !dados.observacao || !dados.requisitos) {
    throw new Error('Dados obrigatórios faltando');
  } 
  const topicoEditado = await TopicoModel.editarTopico(id, dados);
  return topicoEditado;
};

const listarTopicosComPerguntas = async () => {
  const topicosComPerguntas = await TopicoModel.listarTopicosComPerguntas();
  return topicosComPerguntas;
};

module.exports = {
  cadastrarTopico,
  listarTopicos,
  editarTopico,
  listarTopicosComPerguntas
};