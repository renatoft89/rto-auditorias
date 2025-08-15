const AuditoriasModel = require('../models/Auditorias.Model');

const cadastrarAuditoria = async (data) => {
  const { auditoriaData, respostas } = data;

  if (!auditoriaData || !respostas || respostas.length === 0) {
    throw new Error('Dados da auditoria ou respostas obrigatórias faltando.');
  }
  if (!auditoriaData.id_usuario || !auditoriaData.id_cliente || !auditoriaData.dt_auditoria) {
    throw new Error('Dados obrigatórios da auditoria faltando (id_usuario, id_cliente, dt_auditoria).');
  }

  try {
    const novaAuditoriaId = await AuditoriasModel.cadastrarAuditoria(auditoriaData);

    const promessasRespostas = respostas.map(resposta => {
      return AuditoriasModel.cadastrarResposta({
        id_auditoria: novaAuditoriaId,
        id_pergunta: resposta.id_pergunta,
        st_pergunta: resposta.st_pergunta,
        comentario: resposta.comentario
      });
    });

    await Promise.all(promessasRespostas);
    return {
      id: novaAuditoriaId,
      auditoriaData,
      respostas
    };

  } catch (error) {
    console.error('Erro no service ao cadastrar auditoria:', error);
    throw new Error('Erro ao salvar a auditoria e suas respostas.');
  }
};

const listaAuditorias = async () => {
  const auditorias = await AuditoriasModel.listaAuditorias()

  return auditorias
}

module.exports = {
  cadastrarAuditoria,
  listaAuditorias
};