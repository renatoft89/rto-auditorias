const topicosModel = require('../models/Topicos.Model');
const perguntasModel = require('../models/Perguntas.Model');
const connection = require('../database/connection');

const listarTopicosComPerguntas = (status) => {
    const includeInactive = status === 'todos';
    return topicosModel.listarTopicosComPerguntas(includeInactive);
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

        await topicosModel.shiftOrders(dadosTopico.ordem_topico, conn);

        const novoTopicoId = await topicosModel.cadastrarTopico({ ...dadosTopico, usuario_id: usuario.id }, conn);

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

// --- FUNÇÃO PRINCIPAL MODIFICADA ---
const salvarTopicoEditado = async (dadosTopico, usuario) => {
    const { topico_id_original, nome_tema, requisitos, perguntas, ordem_topico: nova_ordem } = dadosTopico;

    if (!topico_id_original) {
        return { error: true, message: 'ID do tópico original é obrigatório para edição.', statusCode: 400 };
    }

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Busca o estado original do tópico que estamos editando
        const topicoOriginal = await topicosModel.buscarTopicoPorId(topico_id_original, conn);
        if (!topicoOriginal) {
            await conn.rollback();
            return { error: true, message: 'Tópico original não encontrado.', statusCode: 404 };
        }
        const ordem_antiga = topicoOriginal.ordem_topico;

        // 2. Desativa a versão original do tópico
        await topicosModel.atualizarStatusAtivoTopico(topico_id_original, false, conn);
        
        // 3. Lógica de INVERSÃO (SWAP): Se a ordem foi alterada, move o outro tópico
        if (nova_ordem !== ordem_antiga) {
             await topicosModel.atualizarOrdemPorPosicao(ordem_antiga, nova_ordem, conn);
        }

        // 4. Cadastra o novo tópico (a nova versão) com os dados atualizados
        const novoTopicoId = await topicosModel.cadastrarTopico({
            nome_tema, requisitos, ordem_topico: nova_ordem, usuario_id: usuario.id
        }, conn);

        // 5. Insere as perguntas para a nova versão, preservando as perguntas da versão antiga
        if (perguntas && perguntas.length > 0) {
            await perguntasModel.inserirMultiplasPerguntas(novoTopicoId, perguntas, conn);
        }
        
        await topicosModel.reordenarTopicos(conn);

        await conn.commit();
        return { message: 'Tópico salvo como nova versão com sucesso!', id: novoTopicoId };
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