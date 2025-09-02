const AuditoriasModel = require('../models/Auditorias.Model');
const ArquivosModel = require('../models/Arquivos.Model');


const cadastrarAuditoria = async (data) => {
  const { auditoriaData, respostas } = data;

  try {
    const novaAuditoriaId = await AuditoriasModel.cadastrarAuditoria(auditoriaData);

    for (const resposta of respostas) {
      const novaRespostaId = await AuditoriasModel.cadastrarResposta({
        id_auditoria: novaAuditoriaId,
        id_pergunta: resposta.id_pergunta,
        st_pergunta: resposta.st_pergunta,
        comentario: resposta.comentario
      });

      if (resposta.fotos && resposta.fotos.length > 0) {
        const fotosValidas = resposta.fotos.filter(url => url);
        const promessasFotos = fotosValidas.map(url => {
          return ArquivosModel.inserirArquivos({
            id_resposta: novaRespostaId,
            tipo: 'Foto',
            caminho: url
          });
        });
        await Promise.all(promessasFotos);
      }
    }

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
  const auditorias = await AuditoriasModel.listaAuditorias();

  return auditorias;
};

const listaAuditoriaPorID = async (id_auditoria) => {
  const dados = await AuditoriasModel.listaAuditoriaPorID(id_auditoria);

  if (!dados || dados.length === 0) {
    return null;
  }

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
    respostas: {},
    observacoes: {},
    fotos: {},
  };

  const topicosMap = new Map();

  dados.forEach(row => {
    if (!topicosMap.has(row.id_topico)) {
      topicosMap.set(row.id_topico, {
        id: row.id_topico,
        nome_tema: row.nome_tema,
        requisitos: row.requisitos,
        perguntas: [],
      });
    }

    if (!topicosMap.get(row.id_topico).perguntas.some(p => p.id === row.id_pergunta)) {
      topicosMap.get(row.id_topico).perguntas.push({
        id: row.id_pergunta,
        descricao_pergunta: row.descricao_pergunta,
        ordem_pergunta: row.ordem_pergunta,
      });
    }

    resultado.respostas[row.id_pergunta] = row.st_pergunta;
    resultado.observacoes[row.id_pergunta] = row.comentario || '';

    resultado.fotos[row.id_pergunta] = row.caminhos_fotos
      ? row.caminhos_fotos.split(',')
      : [];
  });

  resultado.topicos = Array.from(topicosMap.values());
  resultado.topicos.sort((a, b) => a.id - b.id);

  return resultado;
};

const listarDashboard = async (clienteId, ano) => {
  const dadosBrutos = await AuditoriasModel.listarDashboard(clienteId, ano);

  if (!dadosBrutos || dadosBrutos.length === 0) {
    return { processos: [], resultadosMensais: [] };
  }

  const auditoriasAgrupadas = new Map();
  dadosBrutos.forEach(row => {
    const auditoriaId = row.auditoria_id;
    if (!auditoriasAgrupadas.has(auditoriaId)) {
      auditoriasAgrupadas.set(auditoriaId, {
        id: auditoriaId,
        dt_auditoria: row.dt_auditoria,
        topicos: new Map()
      });
    }
    const auditoria = auditoriasAgrupadas.get(auditoriaId);
    if (!auditoria.topicos.has(row.topico_id)) {
      auditoria.topicos.set(row.topico_id, {
        id: row.topico_id,
        nome_tema: row.nome_tema,
        perguntas: []
      });
    }
    auditoria.topicos.get(row.topico_id).perguntas.push({
      id: row.pergunta_id,
      st_pergunta: row.st_pergunta
    });
  });

  const auditoriasConsolidadas = Array.from(auditoriasAgrupadas.values());

  const processosTabela = new Map();
  const resultadosMensaisTabela = new Map();

  auditoriasConsolidadas.forEach(auditoria => {
    const mes = new Date(auditoria.dt_auditoria).getMonth();

    if (!resultadosMensaisTabela.has(mes)) {
      resultadosMensaisTabela.set(mes, { soma: 0, count: 0 });
    }
    let somaAuditoria = 0;
    let countAuditoria = 0;

    auditoria.topicos.forEach(topico => {
      if (!processosTabela.has(topico.id)) {
        processosTabela.set(topico.id, {
          id: topico.id,
          nome_tema: topico.nome_tema,
          resultados: new Map()
        });
      }

      let somaRespostas = 0;
      let totalPerguntas = 0;
      topico.perguntas.forEach(pergunta => {
        if (pergunta.st_pergunta === 'CF') {
          somaRespostas += 1;
          totalPerguntas++;
        } else if (pergunta.st_pergunta === 'PC') {
          somaRespostas += 0.5;
          totalPerguntas++;
        } else if (pergunta.st_pergunta === 'NC') {
          totalPerguntas++;
        }
      });

      const percentualTopico = totalPerguntas > 0 ? (somaRespostas / totalPerguntas) : null;

      if (percentualTopico !== null) {
        const resultadosTopicoDoMes = processosTabela.get(topico.id).resultados;
        if (!resultadosTopicoDoMes.has(mes)) {
          resultadosTopicoDoMes.set(mes, { soma: 0, count: 0 });
        }
        resultadosTopicoDoMes.get(mes).soma += percentualTopico;
        resultadosTopicoDoMes.get(mes).count++;

        somaAuditoria += percentualTopico;
        countAuditoria++;
      }
    });

    if (countAuditoria > 0) {
      resultadosMensaisTabela.get(mes).soma += (somaAuditoria / countAuditoria);
      resultadosMensaisTabela.get(mes).count++;
    }
  });

  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  // A nova formatação aninha os resultados mensais dentro de cada processo
  const processosFormatados = Array.from(processosTabela.values()).map(topico => {
    const resultadosMensaisTopico = meses.map((mes, index) => {
      const resultadoMes = topico.resultados.get(index);
      return resultadoMes && resultadoMes.count > 0 ? Math.round((resultadoMes.soma / resultadoMes.count) * 100) : null;
    });

    const obj = {
      id: topico.id,
      nome_tema: topico.nome_tema,
    };
    meses.forEach((mes, index) => {
      obj[mes] = resultadosMensaisTopico[index];
    });
    return obj;
  });

  const resultadosMensaisFormatados = meses.map((mes, index) => {
    const resultadoMes = resultadosMensaisTabela.get(index);
    const media = resultadoMes && resultadoMes.count > 0 ? Math.round((resultadoMes.soma / resultadoMes.count) * 100) : null;
    return {
      mes: `${mes.toUpperCase()}/${String(ano).substring(2)}`,
      resultado: media
    };
  });

  return {
    processos: processosFormatados,
    resultadosMensais: resultadosMensaisFormatados
  };
};

module.exports = {
  cadastrarAuditoria,
  listaAuditorias,
  listaAuditoriaPorID,
  listarDashboard
};