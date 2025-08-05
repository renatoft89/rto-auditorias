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

const listarTopicosComPerguntas = async () => {
  const query = `
    SELECT 
      t.id AS topico_id,
      t.nome_tema,
      t.requisitos,
      t.observacao,
      t.dt_registro AS topico_dt_registro,

      p.id AS pergunta_id,
      p.descricao_pergunta,
      p.ordem_pergunta,
      p.dt_registro AS pergunta_dt_registro
    FROM topicos t
    LEFT JOIN perguntas p ON t.id = p.id_topico
    ORDER BY t.id, p.ordem_pergunta;
  `;

  const [rows] = await connection.query(query);

  // Agrupar perguntas por tópico
  const topicosMap = new Map();

  for (const row of rows) {
    if (!topicosMap.has(row.topico_id)) {
      topicosMap.set(row.topico_id, {
        id: row.topico_id,
        nome_tema: row.nome_tema,
        requisitos: row.requisitos,
        observacao: row.observacao,
        dt_registro: row.topico_dt_registro,
        perguntas: []
      });
    }

    if (row.pergunta_id) {
      topicosMap.get(row.topico_id).perguntas.push({
        id: row.pergunta_id,
        descricao_pergunta: row.descricao_pergunta,
        ordem_pergunta: row.ordem_pergunta,
        dt_registro: row.pergunta_dt_registro
      });
    }
  }

  // Converter Map para Array e filtrar tópicos sem perguntas
  return Array.from(topicosMap.values()).filter(topico => topico.perguntas.length > 0);
};

const editarTopico = async (id, dados) => {
  const { nome_tema, observacao, requisitos } = dados;
  const query = 'UPDATE topicos SET nome_tema = ?, observacao = ?, requisitos = ? WHERE id = ?';
  await connection.query(query, [nome_tema, observacao, requisitos, id]);
  return { id, ...dados };
};

const verificaTopicoExistente = async (nomeTema) => {
    const query = 'SELECT 1 FROM topicos WHERE nome_tema = ? LIMIT 1';
    const [result] = await connection.query(query, [nomeTema]);

    return result.length > 0;
};

module.exports = {
  cadastrarTopico,
  listarTopicos,
  editarTopico,
  listarTopicosComPerguntas,
  verificaTopicoExistente
}