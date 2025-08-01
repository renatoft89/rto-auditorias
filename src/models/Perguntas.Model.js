const connection = require('../database/connection');

const cadastrarPergunta = async (pergunta) => {
  const { id_topico, descricao_pergunta, ordem_pergunta } = pergunta;

  const query = 'INSERT INTO perguntas (id_topico, descricao_pergunta, ordem_pergunta) VALUES (?, ?, ?)';
  const [result] = await connection.query(query, [id_topico, descricao_pergunta, ordem_pergunta]);
  return result.insertId;
};

module.exports = {
  cadastrarPergunta,
};