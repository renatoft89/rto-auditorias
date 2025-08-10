const connection = require('../database/connection');

const cadastrarAuditoria = async (auditoriaData) => {
  const { id_usuario, id_cliente, observacao, dt_auditoria } = auditoriaData;

  const query = 'INSERT INTO auditorias (id_usuario, id_cliente, observacao, dt_auditoria) VALUES (?, ?, ?, ?)';
  const [result] = await connection.query(query, [id_usuario, id_cliente, observacao, dt_auditoria]);
  
  return result.insertId;
};

const cadastrarResposta = async (respostaData) => {
  const { id_auditoria, id_pergunta, st_pergunta, comentario } = respostaData;

  const query = 'INSERT INTO respostas (id_auditoria, id_pergunta, st_pergunta, comentario) VALUES (?, ?, ?, ?)';

  await connection.query(query, [id_auditoria, id_pergunta, st_pergunta, comentario]);
};

module.exports = {
  cadastrarAuditoria,
  cadastrarResposta
};