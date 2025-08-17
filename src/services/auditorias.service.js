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
};

const listaAuditoriaPorID = async (id_auditoria) => {
  const dados = await AuditoriasModel.listaAuditoriaPorID(id_auditoria);

  if (!dados || dados.length === 0) {
    return null;
  }

  // Objeto para estruturar o resultado final
  const resultado = {
    auditoriaInfo: {
      id: dados[0].id_auditoria,
      dt_auditoria: dados[0].dt_auditoria,
      observacao: dados[0].observacao,
      auditorResponsavel: dados[0].nome_auditor,
    },
    clienteInfo: {
      id: dados[0].id_cliente,
      razao_social: dados[0].nome_cliente,
      cnpj: dados[0].cnpj,
    },
    topicos: [],
    respostas: {}
  };

  const topicosMap = new Map();

  // Itera sobre as linhas do banco de dados para agrupar e formatar os dados
  dados.forEach(row => {
    if (!topicosMap.has(row.id_topico)) {
      topicosMap.set(row.id_topico, {
        id: row.id_topico,
        nome_tema: row.nome_tema,
        requisitos: row.requisitos,
        perguntas: [],
      });
    }

    topicosMap.get(row.id_topico).perguntas.push({
      id: row.id_pergunta,
      descricao_pergunta: row.descricao_pergunta,
      ordem_pergunta: row.ordem_pergunta,
    });

    // Usa o ID da pergunta como chave para a resposta, seguindo a lógica do frontend
    resultado.respostas[row.id_pergunta] = row.st_pergunta;
  });

  // Converte o Map em um array e ordena por ordem do tópico
  resultado.topicos = Array.from(topicosMap.values());
  
  // O seu código está muito bom! Apenas para garantir, podemos ordenar os tópicos para a apresentação.
  // Se o seu backend já retorna os tópicos ordenados, essa linha é opcional.
  resultado.topicos.sort((a, b) => a.id - b.id);
  
  return resultado;
};

module.exports = {
  cadastrarAuditoria,
  listaAuditorias,
  listaAuditoriaPorID
};