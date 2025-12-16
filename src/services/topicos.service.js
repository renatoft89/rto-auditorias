const topicosModel = require('../models/Topicos.Model');
const perguntasModel = require('../models/Perguntas.Model');
const connection = require('../database/connection');

const listarTopicosComPerguntas = async (status) => {
    const includeInactive = status === 'todos';
    const topicos = await topicosModel.listarTopicosComPerguntas(includeInactive);

    const ids = topicos.map(t => t.id);
    const duplicatas = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicatas.length > 0) {
        console.error('ERRO Backend: Tópicos duplicados retornados pelo Model:', duplicatas);
        console.log('IDs completos:', ids);
    }
    
    return topicos;
};

const cadastrarTopico = async (dadosTopico, usuario) => {
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const topicoExistente = await topicosModel.verificaTopicoExistente(dadosTopico.nome_tema, conn);
        if (topicoExistente) {
            await conn.rollback();
            return { error: true, message: 'Tópico com este nome já existe.', statusCode: 409 };
        }

        const [rows] = await conn.query(
            'SELECT COALESCE(MAX(ordem_topico), 0) AS max_ordem FROM topicos WHERE is_active = 1'
        );
        const novaOrdem = ((rows && rows[0] && rows[0].max_ordem) || 0) + 1;

        const novoTopicoId = await topicosModel.cadastrarTopico(
            { ...dadosTopico, usuario_id: usuario.id, ordem_topico: novaOrdem },
            conn
        );

        if (dadosTopico.perguntas && dadosTopico.perguntas.length > 0) {
            await perguntasModel.inserirMultiplasPerguntas(novoTopicoId, dadosTopico.perguntas, conn);
        }
        
        await conn.commit();
        return { message: 'Tópico cadastrado com sucesso!', id: novoTopicoId };
    } catch (error) {
        await conn.rollback();
        console.error("Erro na transação ao cadastrar tópico:", error);
        throw error;
    } finally {
        conn.release();
    }
};


const salvarTopicoEditado = async (dadosTopico, usuario) => {
    const { id, topico_id_original, nome_tema, requisitos, perguntas, ordem_topico } = dadosTopico;
    const topicoId = id || topico_id_original;

    if (!topicoId) {
        return { error: true, message: 'ID do tópico é obrigatório para edição.', statusCode: 400 };
    }

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const topicoOriginal = await topicosModel.buscarTopicoPorId(topicoId, conn);
        if (!topicoOriginal) {
            await conn.rollback();
            return { error: true, message: 'Tópico não encontrado.', statusCode: 404 };
        }

        const query = 'UPDATE topicos SET nome_tema = ?, requisitos = ? WHERE id = ?';
        const [result] = await conn.query(query, [nome_tema, requisitos, topicoId]);

        if (result.affectedRows === 0) {
            await conn.rollback();
            return { error: true, message: 'Falha ao atualizar tópico.', statusCode: 500 };
        }

        const novaOrdemTopico = ordem_topico;
        if (
            typeof novaOrdemTopico !== 'undefined' &&
            novaOrdemTopico !== null &&
            topicoOriginal.is_active === 1 &&
            novaOrdemTopico !== topicoOriginal.ordem_topico
        ) {
            const novaOrdemNumero = Number(novaOrdemTopico);
            if (!Number.isNaN(novaOrdemNumero) && novaOrdemNumero > 0) {
                await topicosModel.trocarOrdemTopicos(
                    topicoId,
                    topicoOriginal.ordem_topico,
                    novaOrdemNumero,
                    conn
                );
            }
        }

        if (perguntas && perguntas.length > 0) {
            for (const pergunta of perguntas) {
                if (pergunta.id) {
                    const queryPergunta = 'UPDATE perguntas SET descricao_pergunta = ?, ordem_pergunta = ? WHERE id = ?';
                    await conn.query(queryPergunta, [pergunta.descricao_pergunta, pergunta.ordem_pergunta, pergunta.id]);
                } else if (pergunta.descricao_pergunta && pergunta.descricao_pergunta.trim() !== '') {
                    const queryNovaP = 'INSERT INTO perguntas (id_topico, descricao_pergunta, ordem_pergunta, is_active) VALUES (?, ?, ?, 1)';
                    await conn.query(queryNovaP, [topicoId, pergunta.descricao_pergunta, pergunta.ordem_pergunta || 1]);
                }
            }
        }

        await conn.commit();
        return { 
            message: 'Próximas auditorias usarão versão atualizada.', 
            id: topicoId,
            nota: 'Sistema de Snapshots mantém integridade de auditorias antigas'
        };
    } catch (error) {
        await conn.rollback();
        console.error('Erro na transação ao salvar tópico editado:', error);
        throw error;
    } finally {
        conn.release();
    }
};


const atualizarStatus = async (id, dados) => {
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();
        
        const affectedRows = await topicosModel.atualizarStatusAtivoTopico(id, dados.isActive, conn);

        if (affectedRows > 0) {
            await topicosModel.reordenarTopicos(conn);
            await conn.commit();
            return { message: `Tópico ${dados.isActive ? 'ativado' : 'desativado'} com sucesso.` };
        } else {
            await conn.rollback();
            return { error: true, message: 'Tópico não encontrado.', statusCode: 404 };
        }
    } catch (error) {
        await conn.rollback();
        console.error("Erro na transação ao ativar/desativar tópico:", error);
        throw error;
    } finally {
        conn.release();
    }
};

const excluirTopico = async (id) => {
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();
        
        const emUso = await topicosModel.verificarUsoTopico(id, conn);
        if (emUso) {
            await conn.rollback();
            return { error: true, message: 'Este tópico não pode ser excluído, pois já foi utilizado em auditorias.', statusCode: 403 };
        }

        const excluido = await topicosModel.excluirTopicoPorId(id, conn);
        if (!excluido) {
            await conn.rollback();
            return { error: true, message: 'Tópico não encontrado.', statusCode: 404 };
        }
        
        await topicosModel.reordenarTopicos(conn);
        
        await conn.commit();
        return { message: 'Tópico excluído com sucesso.' };
    } catch(error) {
        await conn.rollback();
        console.error("Erro na transação ao excluir tópico:", error);
        throw error;
    } finally {
        conn.release();
    }
};

module.exports = {
  listarTopicosComPerguntas,
  cadastrarTopico,
  salvarTopicoEditado,
  atualizarStatus,
  excluirTopico,
};