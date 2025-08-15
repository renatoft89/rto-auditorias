const connection = require('../database/connection');

const cadastrarAuditoria = async (auditoriaData) => {
  const { id_usuario, id_cliente, observacao, dt_auditoria } = auditoriaData;

  const query = 'INSERT INTO auditorias (id_usuario, id_cliente, observacao, dt_auditoria) VALUES (?, ?, ?, ?)';
  const [result] = await connection.query(query, [id_usuario, id_cliente, observacao, dt_auditoria]);
  
  return result.insertId;
};

const listaAuditorias = async () => {

  const query = `
    SELECT 
      a.id,
      a.dt_auditoria,
      a.observacao,
      c.razao_social AS cliente_razao_social,
      c.cnpj AS cliente_cnpj
    FROM 
      auditorias a
    JOIN 
      clientes c ON a.id_cliente = c.id
    ORDER BY 
      a.dt_auditoria DESC;
  `;
  
  const [rows] = await connection.query(query);
  return rows;
};

const cadastrarResposta = async (respostaData) => {
  const { id_auditoria, id_pergunta, st_pergunta, comentario } = respostaData;

  const query = 'INSERT INTO respostas (id_auditoria, id_pergunta, st_pergunta, comentario) VALUES (?, ?, ?, ?)';

  await connection.query(query, [id_auditoria, id_pergunta, st_pergunta, comentario]);
};

module.exports = {
  cadastrarAuditoria,
  listaAuditorias,
  cadastrarResposta
};
