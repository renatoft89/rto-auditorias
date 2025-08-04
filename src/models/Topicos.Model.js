const connection = require('../database/connection');

const cadastrarTopico = async (topico) => {
  const { nome_tema, observacao, requisitos, usuario_id } = topico;

  const query = 'INSERT INTO topicos (nome_tema, observacao, requisitos, usuario_id) VALUES (?, ?, ?, ?)';
  const [result] = await connection.query(query, [nome_tema, observacao, requisitos, usuario_id]);
  return result.insertId;
};

const listarTopicos = async () => {
  const query = 'SELECT * FROM topicos';
  const [listaDeTopicos] = await connection.query(query);
  return listaDeTopicos;
};

const editarTopico = async (id, dados) => {
  const { nome_tema, observacao, requisitos } = dados;
  const query = 'UPDATE topicos SET nome_tema = ?, observacao = ?, requisitos = ? WHERE id = ?';
  await connection.query(query, [nome_tema, observacao, requisitos, id]);
  return { id, ...dados };
};

const listarTopicosComPerguntas = async () => {
  const query = `SELECT t.*, p.id AS pergunta_id, p.descricao_pergunta
                 FROM topicos t
                 LEFT JOIN perguntas p ON t.id = p.id_topico
                 ORDER BY t.id, p.ordem_pergunta`;
  const [result] = await connection.query(query);
  return result;
};

module.exports = {
  cadastrarTopico,
  listarTopicos,
  editarTopico,
  listarTopicosComPerguntas
}