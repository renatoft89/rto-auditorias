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

module.exports = {
  cadastrarTopico,
  listarTopicos
}