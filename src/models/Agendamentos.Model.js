const connection = require('../database/connection');

const agendarAuditoria = async ({ cliente, usuario, data_auditoria, observacoes }) => {
  const query = 'INSERT INTO agendamentos (cliente_id, usuario_id, data_auditoria, observacoes) VALUES (?, ?, ?, ?)';
  const [result] = await connection.query(query, [cliente.id, usuario.id, data_auditoria, observacoes]);
  return result.insertId;
};

const buscarAgendamentosFuturos = async () => {
  const query = `
    SELECT
      a.id,
      a.data_auditoria,
      a.observacoes,
      c.razao_social AS cliente_razao_social,
      u.nome AS auditor_nome
    FROM
      agendamentos a
    JOIN
      clientes c ON a.cliente_id = c.id
    JOIN
      usuarios u ON a.usuario_id = u.id
    WHERE
      a.data_auditoria >= CURDATE()
    ORDER BY
      a.data_auditoria ASC;
  `;

  const [agendamentos] = await connection.query(query);
  return agendamentos;
};


const deletarAgendamentoPorId = async (id) => {
  const query = 'DELETE FROM agendamentos WHERE id = ?';
  const [result] = await connection.query(query, [id]);
  return result.affectedRows;
};

module.exports = {
  agendarAuditoria,
  buscarAgendamentosFuturos,
  deletarAgendamentoPorId,
};