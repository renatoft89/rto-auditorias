const connection = require('../database/connection');

const cadastrarTopico = async (topico) => {
  const { nome_tema, observacao, usuario_id } = topico;

  const query = 'INSERT INTO topicos (nome_tema, observacao, usuario_id) VALUES (?, ?, ?)';
  const [result] = await connection.query(query, [nome_tema, observacao, usuario_id]);
  return result.insertId;
};

module.exports = {
  cadastrarTopico
};