const connection = require('../database/connection');

const shiftOrders = async (ordem_topico, conn = connection) => {
  const query = `
    UPDATE topicos
    SET ordem_topico = ordem_topico + 1
    WHERE is_active = 1 AND ordem_topico >= ?
    ORDER BY ordem_topico DESC;
  `;
  await conn.query(query, [ordem_topico]);
};

const cadastrarTopico = async (topico, conn = connection) => {
  const { nome_tema, requisitos, usuario_id, is_active = 1, ordem_topico } = topico;
  const query = 'INSERT INTO topicos (nome_tema, requisitos, usuario_id, is_active, ordem_topico) VALUES (?, ?, ?, ?, ?)';
  const [result] = await conn.query(query, [nome_tema, requisitos, usuario_id, is_active, ordem_topico]);
  return result.insertId;
};

const listarTopicosComPerguntas = async (includeInactive = false) => {
  const whereClause = includeInactive ? '' : 'WHERE t.is_active = 1';
  
  const query = `
    SELECT
      t.id, t.nome_tema, t.requisitos, t.ordem_topico, t.dt_registro, t.is_active,
      (SELECT COUNT(*) FROM respostas r JOIN perguntas pr ON r.id_pergunta = pr.id WHERE pr.id_topico = t.id) > 0 AS has_responses,
      p.id AS pergunta_id, p.descricao_pergunta, p.ordem_pergunta, p.is_active AS pergunta_is_active
    FROM topicos t
    LEFT JOIN perguntas p ON t.id = p.id_topico
    ${whereClause}
    ORDER BY p.ordem_pergunta;
  `;

  const [rows] = await connection.query(query);
  const topicosMap = new Map();

  for (const row of rows) {
    if (!topicosMap.has(row.id)) {
      topicosMap.set(row.id, {
        id: row.id,
        nome_tema: row.nome_tema,
        requisitos: row.requisitos,
        ordem_topico: row.ordem_topico,
        dt_registro: row.dt_registro,
        is_active: row.is_active,
        is_deletable: !row.has_responses,
        perguntas: []
      });
    }
    if (row.pergunta_id) {
      topicosMap.get(row.id).perguntas.push({
        id: row.pergunta_id,
        descricao_pergunta: row.descricao_pergunta,
        ordem_pergunta: row.ordem_pergunta,
        is_active: row.pergunta_is_active,
      });
    }
  }

  const allTopicos = Array.from(topicosMap.values());

  allTopicos.sort((a, b) => {
    if (a.is_active && !b.is_active) return -1;
    if (!a.is_active && b.is_active) return 1;
    if (!a.is_active && !b.is_active) {
      return a.nome_tema.localeCompare(b.nome_tema);
    }
    return a.ordem_topico - b.ordem_topico;
  });

  return allTopicos;
};

// ATENÇÃO: Função modificada para a lógica de SWAP
const atualizarStatusAtivoTopico = async (id, isActive, conn = connection) => {
  let query;
  if (isActive) {
    // Ao reativar um tópico, ele vai para o final da lista para evitar conflitos
    query = `UPDATE topicos SET is_active = 1, ordem_topico = (SELECT COALESCE(MAX(ordem), 0) + 1 FROM (SELECT ordem_topico AS ordem FROM topicos WHERE id != ?) AS t2) WHERE id = ?`;
     const [result] = await conn.query(query, [id, id]);
     return result.affectedRows;
  } else {
    // Ao desativar, seja na edição ou no botão, anulamos a ordem para liberar a posição
    query = 'UPDATE topicos SET is_active = 0, ordem_topico = NULL WHERE id = ?';
    const [result] = await conn.query(query, [id]);
    return result.affectedRows;
  }
};

const verificaTopicoExistente = async (nomeTema, conn = connection) => {
  const query = 'SELECT 1 FROM topicos WHERE nome_tema = ? AND is_active = 1 LIMIT 1';
  const [result] = await conn.query(query, [nomeTema]);
  return result.length > 0;
};

const reordenarTopicos = async (conn = connection) => {
  // Esta versão usa a função de janela (Window Function) ROW_NUMBER(),
  // que é mais moderna, segura e executada em um único comando SQL.
  const query = `
    WITH ordered AS (
      SELECT 
        id, 
        ROW_NUMBER() OVER (ORDER BY ordem_topico ASC, id ASC) AS nova_ordem
      FROM topicos
      WHERE is_active = 1
    )
    UPDATE topicos t
    JOIN ordered o ON t.id = o.id
    SET t.ordem_topico = o.nova_ordem
    WHERE t.is_active = 1;
  `;
  const [result] = await conn.query(query);
  return result.affectedRows;
};

const verificarUsoTopico = async (id, conn = connection) => {
  const query = `SELECT 1 FROM respostas r JOIN perguntas p ON r.id_pergunta = p.id WHERE p.id_topico = ? LIMIT 1`;
  const [result] = await conn.query(query, [id]);
  return result.length > 0;
};

const excluirTopicoPorId = async (id, conn = connection) => {
  const query = 'DELETE FROM topicos WHERE id = ?';
  const [result] = await conn.query(query, [id]);
  return result.affectedRows > 0;
};

// --- NOVAS FUNÇÕES ADICIONADAS ---

const buscarTopicoPorId = async (id, conn = connection) => {
  const query = 'SELECT * FROM topicos WHERE id = ?';
  const [rows] = await conn.query(query, [id]);
  return rows[0];
};

const atualizarOrdemPorPosicao = async (novaPosicao, posicaoAlvo, conn = connection) => {
  const query = 'UPDATE topicos SET ordem_topico = ? WHERE ordem_topico = ? AND is_active = 1';
  const [result] = await conn.query(query, [novaPosicao, posicaoAlvo]);
  return result.affectedRows;
};


module.exports = {
  shiftOrders,
  cadastrarTopico,
  listarTopicosComPerguntas,
  atualizarStatusAtivoTopico,
  verificaTopicoExistente,
  reordenarTopicos,
  verificarUsoTopico,
  excluirTopicoPorId,
  buscarTopicoPorId,
  atualizarOrdemPorPosicao,
};