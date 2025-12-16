const PerguntasModel = require('../models/Perguntas.Model');
const connection = require('../database/connection');

const cadastrarPergunta = async (pergunta) => {  
  if (!pergunta.id_topico || !pergunta.descricao_pergunta || !pergunta.ordem_pergunta) {
    throw new Error('Dados obrigatórios faltando');
  }

  const existePergunta = await PerguntasModel.verificaPerguntaExistente(pergunta);
  if (existePergunta) {
    throw new Error('Pergunta já cadastrada para este tópico');
  }

  const novoPerguntaId = await PerguntasModel.cadastrarPergunta(pergunta);
  
  return {
    id: novoPerguntaId,
    ...pergunta
  };
}

const atualizarStatus = async (id, isActive) => {
  if (id === undefined || isActive === undefined) {
    return { error: true, message: 'ID da pergunta e status são obrigatórios.', statusCode: 400 };
  }
  
  const linhasAfetadas = await PerguntasModel.atualizarStatus(id, isActive);

  if (linhasAfetadas === 0) {
    return { error: true, message: 'Pergunta não encontrada.', statusCode: 404 };
  }
  
  return { mensagem: `Status da pergunta atualizado com sucesso.` };
};

const editarPergunta = async (id, dadosAtualizados) => {
  if (!id) {
    return { error: true, message: 'ID da pergunta é obrigatório.', statusCode: 400 };
  }

  if (!dadosAtualizados.descricao_pergunta || dadosAtualizados.ordem_pergunta === undefined) {
    return { error: true, message: 'Descrição e ordem são obrigatórios.', statusCode: 400 };
  }

  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    const [pergunta] = await conn.query('SELECT * FROM perguntas WHERE id = ?', [id]);
    if (!pergunta || pergunta.length === 0) {
      await conn.rollback();
      return { error: true, message: 'Pergunta não encontrada.', statusCode: 404 };
    }

    const query = 'UPDATE perguntas SET descricao_pergunta = ?, ordem_pergunta = ? WHERE id = ?';
    const [result] = await conn.query(query, [
      dadosAtualizados.descricao_pergunta,
      dadosAtualizados.ordem_pergunta,
      id
    ]);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return { error: true, message: 'Falha ao atualizar pergunta.', statusCode: 500 };
    }

    await conn.commit();
    return {
      message: 'Pergunta editada com sucesso!',
      id: id,
    };
  } catch (error) {
    await conn.rollback();
    console.error('Erro ao editar pergunta:', error);
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  cadastrarPergunta,
  atualizarStatus,
  editarPergunta,
};