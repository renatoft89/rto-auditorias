const connection = require('../database/connection');

/**
 * Model: TopicosSnapshot
 * Responsabilidade: Gerenciar snapshots imutáveis de tópicos
 * Garante que cada auditoria tenha sua própria cópia dos tópicos
 */

// Copiar todos os tópicos ativos para snapshot de uma auditoria
const criarSnapshotTopicos = async (id_auditoria) => {
  try {
    // 1. Buscar todos os tópicos ativos
    const [topicos] = await connection.query(
      `SELECT id, nome_tema, requisitos, ordem_topico 
       FROM topicos 
       WHERE is_active = 1 
       ORDER BY ordem_topico ASC`
    );

    if (!topicos || topicos.length === 0) {
      throw new Error('Nenhum tópico ativo encontrado para criar snapshots');
    }

    // 2. Inserir cada tópico como snapshot
    const topicosSnapshotIds = [];
    
    for (const topico of topicos) {
      const [result] = await connection.query(
        `INSERT INTO topicos_snapshot 
         (id_auditoria, id_topico_original, nome_tema, requisitos, ordem_topico) 
         VALUES (?, ?, ?, ?, ?)`,
        [id_auditoria, topico.id, topico.nome_tema, topico.requisitos, topico.ordem_topico]
      );
      
      topicosSnapshotIds.push({
        id_snapshot: result.insertId,
        id_topico_original: topico.id
      });
    }

    return topicosSnapshotIds;
  } catch (error) {
    console.error('Erro ao criar snapshot de tópicos:', error);
    throw new Error(`Falha ao criar snapshots de tópicos: ${error.message}`);
  }
};

// Buscar todos os tópicos snapshot de uma auditoria
const buscarTopicosSnapshotPorAuditoria = async (id_auditoria) => {
  try {
    const [topicos] = await connection.query(
      `SELECT 
         id,
         id_auditoria,
         id_topico_original,
         nome_tema,
         requisitos,
         ordem_topico,
         dt_snapshot
       FROM topicos_snapshot
       WHERE id_auditoria = ?
       ORDER BY ordem_topico ASC`,
      [id_auditoria]
    );

    return topicos || [];
  } catch (error) {
    console.error('Erro ao buscar snapshots de tópicos:', error);
    throw new Error(`Falha ao buscar snapshots de tópicos: ${error.message}`);
  }
};

// Buscar um tópico snapshot específico
const buscarTopicosSnapshotPorId = async (id_snapshot) => {
  try {
    const [topico] = await connection.query(
      `SELECT 
         id,
         id_auditoria,
         id_topico_original,
         nome_tema,
         requisitos,
         ordem_topico,
         dt_snapshot
       FROM topicos_snapshot
       WHERE id = ?`,
      [id_snapshot]
    );

    return topico ? topico[0] : null;
  } catch (error) {
    console.error('Erro ao buscar snapshot de tópico por ID:', error);
    throw new Error(`Falha ao buscar snapshot de tópico: ${error.message}`);
  }
};

// Verificar se já existem snapshots para uma auditoria
const temSnapshotsTopicos = async (id_auditoria) => {
  try {
    const [result] = await connection.query(
      `SELECT COUNT(*) as total FROM topicos_snapshot WHERE id_auditoria = ?`,
      [id_auditoria]
    );

    return result[0].total > 0;
  } catch (error) {
    console.error('Erro ao verificar snapshots:', error);
    throw new Error(`Falha ao verificar snapshots: ${error.message}`);
  }
};

// Contar snapshots de uma auditoria
const contarSnapshotsTopicos = async (id_auditoria) => {
  try {
    const [result] = await connection.query(
      `SELECT COUNT(*) as total FROM topicos_snapshot WHERE id_auditoria = ?`,
      [id_auditoria]
    );

    return result[0].total;
  } catch (error) {
    console.error('Erro ao contar snapshots:', error);
    throw new Error(`Falha ao contar snapshots: ${error.message}`);
  }
};

// Buscar snapshots com rastreamento do tópico original
const buscarSnapshotsComRastreamento = async (id_auditoria) => {
  try {
    const [snapshots] = await connection.query(
      `SELECT 
         ts.id,
         ts.id_auditoria,
         ts.id_topico_original,
         ts.nome_tema,
         ts.requisitos,
         ts.ordem_topico,
         ts.dt_snapshot,
         t.nome_tema as nome_tema_original,
         t.requisitos as requisitos_original
       FROM topicos_snapshot ts
       LEFT JOIN topicos t ON ts.id_topico_original = t.id
       WHERE ts.id_auditoria = ?
       ORDER BY ts.ordem_topico ASC`,
      [id_auditoria]
    );

    return snapshots || [];
  } catch (error) {
    console.error('Erro ao buscar snapshots com rastreamento:', error);
    throw new Error(`Falha ao buscar snapshots: ${error.message}`);
  }
};

module.exports = {
  criarSnapshotTopicos,
  buscarTopicosSnapshotPorAuditoria,
  buscarTopicosSnapshotPorId,
  temSnapshotsTopicos,
  contarSnapshotsTopicos,
  buscarSnapshotsComRastreamento
};
