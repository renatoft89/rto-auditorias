const connection = require('../database/connection');

const cadastrarAuditoria = async (auditoriaData) => {
  // CORREÇÃO: Removido 'tipo_auditoria' da desestruturação e da query INSERT
  const { id_usuario, id_cliente, observacao_geral, dt_auditoria, st_auditoria } = auditoriaData;

  // Usa 'observacao' que é o nome da coluna no seu DB atual
  const query = 'INSERT INTO auditorias (id_usuario, id_cliente, observacao, dt_auditoria, st_auditoria) VALUES (?, ?, ?, ?, ?)';
  const [result] = await connection.query(query, [id_usuario, id_cliente, observacao_geral, dt_auditoria, st_auditoria]);

  return result.insertId;
};

const listaAuditorias = async () => {
  // Usa 'a.observacao'
  const query = `
    SELECT
      a.id,
      a.dt_auditoria,
      a.observacao,
      a.st_auditoria,
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

  // Função auxiliar para obter o ID em caso de UPDATE
  const buscarIdResposta = async (id_auditoria, id_pergunta) => {
    const query = 'SELECT id FROM respostas WHERE id_auditoria = ? AND id_pergunta = ?';
    const [rows] = await connection.query(query, [id_auditoria, id_pergunta]);
    return rows[0]?.id || 0;
  }
  return result.insertId || (await buscarIdResposta(id_auditoria, id_pergunta));
};


const listaAuditoriaPorID = async (id) => {
  // CORREÇÃO: Removida a linha 'auditorias.tipo_auditoria,' da lista SELECT
  const query = `
  SELECT
    a.id AS id_auditoria,
    a.dt_auditoria,
    a.observacao, -- Usando nome da coluna existente
    a.st_auditoria,
    c.id AS id_cliente,
    c.razao_social AS nome_cliente,
    c.cnpj,
    u.nome AS nome_auditor,
    t.id AS id_topico,
    t.nome_tema,
    t.requisitos,
    t.ordem_topico,
    p.id AS id_pergunta,
    p.descricao_pergunta,
    p.ordem_pergunta,
    ANY_VALUE(r.st_pergunta) AS st_pergunta,  -- <<< CORREÇÃO AQUI
    ANY_VALUE(r.comentario) AS comentario,    -- <<< CORREÇÃO AQUI
    ANY_VALUE(r.id) as id_resposta,           -- <<< CORREÇÃO AQUI
    GROUP_CONCAT(arq.caminho SEPARATOR ',') AS caminhos_fotos
  FROM auditorias a
  JOIN clientes c ON a.id_cliente = c.id
  JOIN usuarios u ON a.id_usuario = u.id
  CROSS JOIN topicos t -- Garante que todos os tópicos ativos sejam listados
  JOIN perguntas p ON t.id = p.id_topico AND p.is_active = 1 -- Garante perguntas ativas
  LEFT JOIN respostas r ON a.id = r.id_auditoria AND p.id = r.id_pergunta -- Junta respostas SE existirem
  LEFT JOIN arquivos arq ON r.id = arq.id_resposta -- Junta arquivos SE existirem respostas com arquivos
  WHERE a.id = ? AND t.is_active = 1 -- Filtra pela auditoria e tópicos ativos
  GROUP BY a.id, t.id, p.id -- Agrupa por pergunta para agregar fotos corretamente
  ORDER BY t.ordem_topico, p.ordem_pergunta; -- Ordena pela ordem definida`;

  const [rows] = await connection.query(query, [id]);
  return rows;
};

// --- QUERY CORRIGIDA ---
const listarDashboard = async (clienteId, ano) => {
  // Adicionado 'AND a.st_auditoria = 'F'' na cláusula WHERE
  const query = `
    SELECT
      a.id as auditoria_id,
      a.dt_auditoria,
      a.st_auditoria, -- Incluído para garantir que estamos filtrando corretamente
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
      c.id = ? AND YEAR(a.dt_auditoria) = ? AND a.st_auditoria = 'F' -- Filtro de status adicionado
    ORDER BY
      a.dt_auditoria, t.id, p.ordem_pergunta;
  `;
  const [rows] = await connection.query(query, [clienteId, ano]);
  return rows;
};
// --- FIM DA QUERY CORRIGIDA ---

const dataAuditoriaPorCliente = async (clienteId) => {
  // A princípio, podemos mostrar todos os anos, mesmo os com auditorias em andamento.
  // Se precisar filtrar aqui também, adicione "AND st_auditoria = 'F'"
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
