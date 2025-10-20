const connection = require('../database/connection');

const cadastrarAuditoria = async (auditoriaData) => {
  const { id_usuario, id_cliente, observacao_geral, dt_auditoria, st_auditoria } = auditoriaData;
  const query = 'INSERT INTO auditorias (id_usuario, id_cliente, observacao, dt_auditoria, st_auditoria) VALUES (?, ?, ?, ?, ?)';
  const [result] = await connection.query(query, [id_usuario, id_cliente, observacao_geral, dt_auditoria, st_auditoria]);
  return result.insertId;
};

const listaAuditorias = async () => {
  const query = `
    SELECT
      a.id,
      a.dt_auditoria,
      a.observacao,
      a.st_auditoria,
      c.razao_social AS cliente_razao_social,
      c.cnpj AS cliente_cnpj,
      c.responsavel
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

const salvarOuAtualizarResposta = async (respostaData) => {
  const { id_auditoria, id_pergunta, st_pergunta, comentario } = respostaData;
  const query = `
    INSERT INTO respostas (id_auditoria, id_pergunta, st_pergunta, comentario)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      st_pergunta = VALUES(st_pergunta),
      comentario = VALUES(comentario);
  `;
  const [result] = await connection.query(query, [id_auditoria, id_pergunta, st_pergunta, comentario]);
  const buscarIdResposta = async (id_auditoria, id_pergunta) => {
    const query = 'SELECT id FROM respostas WHERE id_auditoria = ? AND id_pergunta = ?';
    const [rows] = await connection.query(query, [id_auditoria, id_pergunta]);
    return rows[0]?.id || 0;
  }
  return result.insertId || (await buscarIdResposta(id_auditoria, id_pergunta));
};

const listaAuditoriaPorID = async (id) => {
  const query = `
  SELECT
    a.id AS id_auditoria,
    a.dt_auditoria,
    a.observacao,
    a.st_auditoria,
    c.id AS id_cliente,
    c.razao_social AS nome_cliente,
    c.cnpj,
    c.responsavel AS cliente_responsavel,
    c.telefone AS cliente_telefone,
    u.id AS id_usuario,
    u.nome AS nome_auditor,
    t.id AS id_topico,
    t.nome_tema,
    t.requisitos,
    t.ordem_topico,
    p.id AS id_pergunta,
    p.descricao_pergunta,
    p.ordem_pergunta,
    r.id as id_resposta,
    r.st_pergunta,
    r.comentario,
    GROUP_CONCAT(arq.caminho SEPARATOR ',') AS caminhos_fotos
  FROM auditorias a
  JOIN clientes c ON a.id_cliente = c.id
  JOIN usuarios u ON a.id_usuario = u.id
  CROSS JOIN topicos t
  JOIN perguntas p ON t.id = p.id_topico AND p.is_active = 1
  LEFT JOIN respostas r ON a.id = r.id_auditoria AND p.id = r.id_pergunta
  LEFT JOIN arquivos arq ON r.id = arq.id_resposta
  WHERE a.id = ? AND t.is_active = 1
  GROUP BY a.id, t.id, p.id, r.id
  ORDER BY t.ordem_topico, p.ordem_pergunta;`;

  const [rows] = await connection.query(query, [id]);
  return rows;
};

const listarDashboard = async (clienteId, ano) => {
  const query = `
    SELECT
      a.id as auditoria_id,
      a.dt_auditoria,
      a.st_auditoria,
      t.id as topico_id,
      t.nome_tema,
      p.id as pergunta_id,
      p.descricao_pergunta,
      r.st_pergunta
    FROM
      auditorias AS a
    JOIN clientes AS c ON a.id_cliente = c.id
    JOIN respostas AS r ON a.id = r.id_auditoria
    JOIN perguntas AS p ON r.id_pergunta = p.id
    JOIN topicos AS t ON p.id_topico = t.id
    WHERE
      c.id = ? AND YEAR(a.dt_auditoria) = ? AND a.st_auditoria = 'F'
    ORDER BY
      a.dt_auditoria, t.id, p.ordem_pergunta;
  `;
  const [rows] = await connection.query(query, [clienteId, ano]);
  return rows;
};

const dataAuditoriaPorCliente = async (clienteId) => {
  const query = `
    SELECT DISTINCT YEAR(dt_auditoria) AS ano
    FROM auditorias
    WHERE id_cliente = ?
    ORDER BY ano;
  `;
  const [rows] = await connection.query(query, [clienteId]);
  return rows;
};

const finalizarAuditoria = async (id) => {
  const query = "UPDATE auditorias SET st_auditoria = 'F' WHERE id = ?";
  const [result] = await connection.query(query, [id]);
  return result.affectedRows;
};

module.exports = {
  cadastrarAuditoria,
  listaAuditorias,
  salvarOuAtualizarResposta,
  listaAuditoriaPorID,
  listarDashboard,
  dataAuditoriaPorCliente,
  finalizarAuditoria,
};
