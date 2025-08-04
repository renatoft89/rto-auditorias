const connection = require('../database/connection');

const cadastrarPergunta = async (pergunta) => {
  const { id_topico, descricao_pergunta, ordem_pergunta } = pergunta;

  const query = 'INSERT INTO perguntas (id_topico, descricao_pergunta, ordem_pergunta) VALUES (?, ?, ?)';
  const [result] = await connection.query(query, [id_topico, descricao_pergunta, ordem_pergunta]);
  return result.insertId;
};

const verificaPerguntaExistente = async (pergunta) => {
  const { id_topico, descricao_pergunta } = pergunta;

  const query = 'SELECT id FROM perguntas WHERE id_topico = ? AND descricao_pergunta = ?';
  const [result] = await connection.query(query, [id_topico, descricao_pergunta]);

  return result.length > 0 ? result[0] : null;
};


module.exports = {
  cadastrarPergunta,
  verificaPerguntaExistente
};