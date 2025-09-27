const connection = require('../database/connection');

const inserirMultiplasPerguntas = async (id_topico, perguntas, conn = connection) => {
  if (!perguntas || perguntas.length === 0) {
    return 0;
  }
  const query = 'INSERT INTO perguntas (id_topico, descricao_pergunta, ordem_pergunta, is_active) VALUES ?';
  const values = perguntas.map(p => [
    id_topico,
    p.descricao_pergunta,
    p.ordem_pergunta,
    p.is_active !== undefined ? p.is_active : 1
  ]);
  const [result] = await conn.query(query, [values]);
  return result.affectedRows;
};

const deletarPerguntasDoTopico = async (id_topico, conn = connection) => {
  const query = 'DELETE FROM perguntas WHERE id_topico = ?';
  const [result] = await conn.query(query, [id_topico]);
  return result.affectedRows;
};

const atualizarStatusAtivoPergunta = async (id, isActive, conn = connection) => {
  const query = 'UPDATE perguntas SET is_active = ? WHERE id = ?';
  const [result] = await conn.query(query, [isActive, id]);
  return result.affectedRows;
};

module.exports = {
  inserirMultiplasPerguntas,
  deletarPerguntasDoTopico,
  atualizarStatusAtivoPergunta,
};