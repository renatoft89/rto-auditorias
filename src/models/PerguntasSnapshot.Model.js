const connection = require('../database/connection');

/**
 * Model: PerguntasSnapshot
 * Responsabilidade: Gerenciar snapshots imutáveis de perguntas
 * Garante que cada auditoria tenha sua própria cópia das perguntas
 */

// Copiar todas as perguntas ativas para snapshot de uma auditoria
// Deve ser chamado APÓS criarSnapshotTopicos()
const criarSnapshotPerguntas = async (id_auditoria, topicosSnapshotIds) => {
  try {
    // topicosSnapshotIds = [
    //   { id_snapshot: 1, id_topico_original: 15 },
    //   { id_snapshot: 2, id_topico_original: 17 },
    //   ...
    // ]

    // 1. Buscar todas as perguntas ativas dos tópicos
    const [perguntas] = await connection.query(
      `SELECT 
         id, 
         id_topico, 
         descricao_pergunta, 
         ordem_pergunta 
       FROM perguntas 
       WHERE is_active = 1 
       ORDER BY id_topico ASC, ordem_pergunta ASC`
    );

    if (!perguntas || perguntas.length === 0) {
      throw new Error('Nenhuma pergunta ativa encontrada para criar snapshots');
    }

    // 2. Mapear id_topico_original → id_topico_snapshot
    const mapaTopicos = {};
    topicosSnapshotIds.forEach(item => {
      mapaTopicos[item.id_topico_original] = item.id_snapshot;
    });

    // 3. Inserir cada pergunta como snapshot
    const perguntasSnapshotIds = [];
    
    for (const pergunta of perguntas) {
      const id_topico_snapshot = mapaTopicos[pergunta.id_topico];
      
      if (!id_topico_snapshot) {
        console.warn(`Tópico snapshot não encontrado para pergunta ${pergunta.id}`);
        continue;
      }

      const [result] = await connection.query(
        `INSERT INTO perguntas_snapshot 
         (id_auditoria, id_pergunta_original, id_topico_snapshot, descricao_pergunta, ordem_pergunta) 
         VALUES (?, ?, ?, ?, ?)`,
        [id_auditoria, pergunta.id, id_topico_snapshot, pergunta.descricao_pergunta, pergunta.ordem_pergunta]
      );
      
      perguntasSnapshotIds.push({
        id_snapshot: result.insertId,
        id_pergunta_original: pergunta.id
      });
    }

    return perguntasSnapshotIds;
  } catch (error) {
    console.error('Erro ao criar snapshot de perguntas:', error);
    throw new Error(`Falha ao criar snapshots de perguntas: ${error.message}`);
  }
};

// Buscar todas as perguntas snapshot de uma auditoria
const buscarPerguntasSnapshotPorAuditoria = async (id_auditoria) => {
  try {
    const [perguntas] = await connection.query(
      `SELECT 
         id,
         id_auditoria,
         id_pergunta_original,
         id_topico_snapshot,
         descricao_pergunta,
         ordem_pergunta,
         dt_snapshot
       FROM perguntas_snapshot
       WHERE id_auditoria = ?
       ORDER BY id_topico_snapshot ASC, ordem_pergunta ASC`,
      [id_auditoria]
    );

    return perguntas || [];
  } catch (error) {
    console.error('Erro ao buscar snapshots de perguntas:', error);
    throw new Error(`Falha ao buscar snapshots de perguntas: ${error.message}`);
  }
};

// Buscar as perguntas snapshot de um tópico snapshot
const buscarPerguntasSnapshotPorTopico = async (id_topico_snapshot) => {
  try {
    const [perguntas] = await connection.query(
      `SELECT 
         id,
         id_auditoria,
         id_pergunta_original,
         id_topico_snapshot,
         descricao_pergunta,
         ordem_pergunta,
         dt_snapshot
       FROM perguntas_snapshot
       WHERE id_topico_snapshot = ?
       ORDER BY ordem_pergunta ASC`,
      [id_topico_snapshot]
    );

    return perguntas || [];
  } catch (error) {
    console.error('Erro ao buscar perguntas snapshot por tópico:', error);
    throw new Error(`Falha ao buscar perguntas snapshot: ${error.message}`);
  }
};

// Buscar uma pergunta snapshot específica
const buscarPerguntaSnapshotPorId = async (id_snapshot) => {
  try {
    const [pergunta] = await connection.query(
      `SELECT 
         id,
         id_auditoria,
         id_pergunta_original,
         id_topico_snapshot,
         descricao_pergunta,
         ordem_pergunta,
         dt_snapshot
       FROM perguntas_snapshot
       WHERE id = ?`,
      [id_snapshot]
    );

    return pergunta ? pergunta[0] : null;
  } catch (error) {
    console.error('Erro ao buscar snapshot de pergunta por ID:', error);
    throw new Error(`Falha ao buscar snapshot de pergunta: ${error.message}`);
  }
};

// Verificar se já existem snapshots de perguntas para uma auditoria
const temSnapshotsPerguntas = async (id_auditoria) => {
  try {
    const [result] = await connection.query(
      `SELECT COUNT(*) as total FROM perguntas_snapshot WHERE id_auditoria = ?`,
      [id_auditoria]
    );

    return result[0].total > 0;
  } catch (error) {
    console.error('Erro ao verificar snapshots de perguntas:', error);
    throw new Error(`Falha ao verificar snapshots: ${error.message}`);
  }
};

// Contar snapshots de perguntas de uma auditoria
const contarSnapshotsPerguntas = async (id_auditoria) => {
  try {
    const [result] = await connection.query(
      `SELECT COUNT(*) as total FROM perguntas_snapshot WHERE id_auditoria = ?`,
      [id_auditoria]
    );

    return result[0].total;
  } catch (error) {
    console.error('Erro ao contar snapshots de perguntas:', error);
    throw new Error(`Falha ao contar snapshots: ${error.message}`);
  }
};

// Buscar snapshots com rastreamento da pergunta original (para auditoria)
const buscarSnapshotsComRastreamento = async (id_auditoria) => {
  try {
    const [snapshots] = await connection.query(
      `SELECT 
         ps.id,
         ps.id_auditoria,
         ps.id_pergunta_original,
         ps.id_topico_snapshot,
         ps.descricao_pergunta,
         ps.ordem_pergunta,
         ps.dt_snapshot,
         p.descricao_pergunta as descricao_original,
         ts.nome_tema
       FROM perguntas_snapshot ps
       LEFT JOIN perguntas p ON ps.id_pergunta_original = p.id
       LEFT JOIN topicos_snapshot ts ON ps.id_topico_snapshot = ts.id
       WHERE ps.id_auditoria = ?
       ORDER BY ts.ordem_topico ASC, ps.ordem_pergunta ASC`,
      [id_auditoria]
    );

    return snapshots || [];
  } catch (error) {
    console.error('Erro ao buscar snapshots com rastreamento:', error);
    throw new Error(`Falha ao buscar snapshots: ${error.message}`);
  }
};

// Buscar toda a estrutura (tópicos e perguntas) de um snapshot de auditoria
const buscarEstruturasSnapshot = async (id_auditoria) => {
  try {
    const [topicos] = await connection.query(
      `SELECT 
         id,
         nome_tema,
         requisitos,
         ordem_topico
       FROM topicos_snapshot
       WHERE id_auditoria = ?
       ORDER BY ordem_topico ASC`,
      [id_auditoria]
    );

    const estrutura = [];
    
    for (const topico of topicos) {
      const [perguntas] = await connection.query(
        `SELECT 
           id,
           descricao_pergunta,
           ordem_pergunta
         FROM perguntas_snapshot
         WHERE id_topico_snapshot = ?
         ORDER BY ordem_pergunta ASC`,
        [topico.id]
      );

      estrutura.push({
        id_topico_snapshot: topico.id,
        nome_tema: topico.nome_tema,
        requisitos: topico.requisitos,
        ordem_topico: topico.ordem_topico,
        perguntas: perguntas || []
      });
    }

    return estrutura;
  } catch (error) {
    console.error('Erro ao buscar estrutura de snapshot:', error);
    throw new Error(`Falha ao buscar estrutura: ${error.message}`);
  }
};

module.exports = {
  criarSnapshotPerguntas,
  buscarPerguntasSnapshotPorAuditoria,
  buscarPerguntasSnapshotPorTopico,
  buscarPerguntaSnapshotPorId,
  temSnapshotsPerguntas,
  contarSnapshotsPerguntas,
  buscarSnapshotsComRastreamento,
  buscarEstruturasSnapshot
};
