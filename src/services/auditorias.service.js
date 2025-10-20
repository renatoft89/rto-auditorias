const AuditoriasModel = require('../models/Auditorias.Model');
const ArquivosModel = require('../models/Arquivos.Model');

const iniciarAuditoria = async (dados, usuario) => {
  const { cliente, auditoria } = dados;

  if (!cliente || !auditoria || !usuario) {
    throw new Error('Dados insuficientes para iniciar a auditoria.');
  }

  const auditoriaData = {
    id_usuario: usuario.id,
    id_cliente: cliente.id,
    observacao: auditoria.observacao_geral, // Coluna 'observacao' no DB
    dt_auditoria: auditoria.dataInicio,
    st_auditoria: 'A',
    // tipo_auditoria não existe no DB atual
  };

  const novaAuditoriaId = await AuditoriasModel.cadastrarAuditoria(auditoriaData);

  // Retorna com 'observacao_geral' para o frontend
  return { id: novaAuditoriaId, ...auditoriaData, observacao_geral: auditoria.observacao_geral };
};

const salvarProgressoAuditoria = async (id_auditoria, dadosResposta) => {
    const { id_pergunta, st_pergunta, comentario, fotos } = dadosResposta;

    if (!id_auditoria || !id_pergunta || !st_pergunta) {
        throw new Error('Dados de resposta incompletos para salvar o progresso.');
    }

    const respostaSalvaId = await AuditoriasModel.salvarOuAtualizarResposta({
        id_auditoria: parseInt(id_auditoria),
        id_pergunta: parseInt(id_pergunta),
        st_pergunta,
        comentario: comentario || ''
    });

    if (respostaSalvaId <= 0) {
        throw new Error('Não foi possível salvar ou atualizar a resposta.');
    }

    await ArquivosModel.deletarArquivosPorResposta(respostaSalvaId);

    if (fotos && Array.isArray(fotos) && fotos.length > 0) {
        const fotosValidas = fotos.filter(url => typeof url === 'string' && url.trim() !== '');
        const promessasFotos = fotosValidas.map(url =>
            ArquivosModel.inserirArquivos({ id_resposta: respostaSalvaId, tipo: 'Foto', caminho: url })
        );
        await Promise.all(promessasFotos);
    }

    return { id_resposta: respostaSalvaId, mensagem: 'Progresso salvo com sucesso.' };
};


const finalizarAuditoria = async (id) => {
    const affectedRows = await AuditoriasModel.finalizarAuditoria(id);
    if (affectedRows === 0) {
        throw new Error('Auditoria não encontrada para finalizar.');
    }
    return { mensagem: 'Auditoria finalizada com sucesso!' };
};

const listaAuditorias = async () => {
  const auditorias = await AuditoriasModel.listaAuditorias();
  return auditorias;
};


const listaAuditoriaPorID = async (id_auditoria) => {
  const dados = await AuditoriasModel.listaAuditoriaPorID(id_auditoria);

  if (!dados || dados.length === 0) {
    console.warn(`Nenhum dado retornado do Model para auditoria ID: ${id_auditoria}`);
    return null; // Retorna null se auditoria não existir
  }

  const infoRow = dados[0];

  if (!infoRow.id_auditoria || !infoRow.id_cliente) {
      console.error(`Dados essenciais (id_auditoria, id_cliente) faltando na resposta do Model para auditoria ID: ${id_auditoria}`, infoRow);
      return null; // Retorna null em caso de dados inconsistentes
  }

  const resultado = {
    auditoriaInfo: {
      id: infoRow.id_auditoria,
      dt_auditoria: infoRow.dt_auditoria,
      observacao: infoRow.observacao,
      auditorResponsavel: infoRow.nome_auditor,
      st_auditoria: infoRow.st_auditoria,
    },
    clienteInfo: {
      id: infoRow.id_cliente,
      razao_social: infoRow.nome_cliente,
      cnpj: infoRow.cnpj,
    },
    topicos: [],
    respostas: {},
    observacoes: {},
    fotos: {},
  };

  const topicosMap = new Map();

  dados.forEach(row => {
    if (!row.id_topico || !row.id_pergunta) return;

    if (!topicosMap.has(row.id_topico)) {
      topicosMap.set(row.id_topico, {
        id: row.id_topico,
        nome_tema: row.nome_tema,
        requisitos: row.requisitos,
        ordem_topico: row.ordem_topico,
        perguntas: [],
      });
    }

    const topicoAtual = topicosMap.get(row.id_topico);
    if (!topicoAtual.perguntas.some(p => p.id === row.id_pergunta)) {
      topicoAtual.perguntas.push({
        id: row.id_pergunta,
        descricao_pergunta: row.descricao_pergunta,
        ordem_pergunta: row.ordem_pergunta,
      });
      resultado.fotos[row.id_pergunta] = [];
      resultado.observacoes[row.id_pergunta] = '';
    }

    if (row.st_pergunta !== null && row.st_pergunta !== undefined) {
      resultado.respostas[row.id_pergunta] = row.st_pergunta;
      resultado.observacoes[row.id_pergunta] = row.comentario || '';
      resultado.fotos[row.id_pergunta] = row.caminhos_fotos ? row.caminhos_fotos.split(',') : [];
    }
  });

  resultado.topicos = Array.from(topicosMap.values());
  resultado.topicos.sort((a, b) => a.ordem_topico - b.ordem_topico);
  resultado.topicos.forEach(t => t.perguntas.sort((a, b) => a.ordem_pergunta - b.ordem_pergunta));

  return resultado;
};

// --- FUNÇÃO CORRIGIDA ---
const listarDashboard = async (clienteId, ano) => {
  const dadosBrutos = await AuditoriasModel.listarDashboard(clienteId, ano);

  // CORREÇÃO: Verifica se dadosBrutos está vazio logo no início
  if (!dadosBrutos || dadosBrutos.length === 0) {
    console.log(`Nenhuma auditoria FINALIZADA encontrada para Cliente ${clienteId} no ano ${ano}.`);
    return { processos: [], resultadosMensais: [] }; // Retorna arrays vazios
  }

  // --- O restante da lógica de processamento continua aqui ---
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
    // Adiciona tópico apenas se ainda não existir
    if (!auditoria.topicos.has(row.topico_id)) {
        auditoria.topicos.set(row.topico_id, {
            id: row.topico_id,
            nome_tema: row.nome_tema,
            perguntas: []
        });
    }
    // Adiciona pergunta apenas se ainda não existir no tópico (evita duplicatas se a query retornar algo inesperado)
    if (!auditoria.topicos.get(row.topico_id).perguntas.some(p => p.id === row.pergunta_id)) {
        auditoria.topicos.get(row.topico_id).perguntas.push({
            id: row.pergunta_id,
            st_pergunta: row.st_pergunta
        });
    }
});


  const auditoriasConsolidadas = Array.from(auditoriasAgrupadas.values());

  const processosTabela = new Map(); // Map<topicoId, {id, nome_tema, resultados: Map<mesIndex, {soma, count}>}>
  const resultadosMensaisTabela = new Map(); // Map<mesIndex, {soma, count}>

  auditoriasConsolidadas.forEach(auditoria => {
    // getMonth() retorna 0 para Janeiro, 1 para Fevereiro, etc.
    const mesIndex = new Date(auditoria.dt_auditoria).getMonth();

    if (!resultadosMensaisTabela.has(mesIndex)) {
      resultadosMensaisTabela.set(mesIndex, { soma: 0, count: 0 });
    }
    let somaPercentuaisAuditoria = 0;
    let countTopicosAuditoria = 0;

    auditoria.topicos.forEach(topico => {
      if (!processosTabela.has(topico.id)) {
        processosTabela.set(topico.id, {
          id: topico.id,
          nome_tema: topico.nome_tema,
          resultados: new Map() // Map<mesIndex, {soma, count}>
        });
      }
      const processo = processosTabela.get(topico.id);

      let somaPontosTopico = 0;
      let perguntasConsideradasTopico = 0; // Contar apenas CF, PC, NC

      topico.perguntas.forEach(pergunta => {
        if (pergunta.st_pergunta === 'CF') {
          somaPontosTopico += 1;
          perguntasConsideradasTopico++;
        } else if (pergunta.st_pergunta === 'PC') {
          somaPontosTopico += 0.5;
          perguntasConsideradasTopico++;
        } else if (pergunta.st_pergunta === 'NC') {
          perguntasConsideradasTopico++;
        }
        // Ignora 'NE' no cálculo do percentual
      });

      // Calcula o percentual apenas se houver perguntas válidas
      const percentualTopico = perguntasConsideradasTopico > 0 ? (somaPontosTopico / perguntasConsideradasTopico) : null;

      if (percentualTopico !== null) {
         // Acumula para a média do tópico naquele mês
        if (!processo.resultados.has(mesIndex)) {
          processo.resultados.set(mesIndex, { soma: 0, count: 0 });
        }
        const resultadoMesTopico = processo.resultados.get(mesIndex);
        resultadoMesTopico.soma += percentualTopico;
        resultadoMesTopico.count++;

        // Acumula para a média geral da auditoria
        somaPercentuaisAuditoria += percentualTopico;
        countTopicosAuditoria++;
      }
    });

    // Calcula a média da auditoria e acumula para a média mensal geral
    if (countTopicosAuditoria > 0) {
      const mediaAuditoria = somaPercentuaisAuditoria / countTopicosAuditoria;
      const resultadoMesGeral = resultadosMensaisTabela.get(mesIndex);
      resultadoMesGeral.soma += mediaAuditoria;
      resultadoMesGeral.count++;
    }
  });

  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const anoStr = String(ano).substring(2); // Pegar os últimos 2 dígitos do ano

  // Formata a tabela de processos
  const processosFormatados = Array.from(processosTabela.values()).map(processo => {
    const objResultado = {
      id: processo.id,
      nome_tema: processo.nome_tema,
    };
    meses.forEach((mes, index) => {
      const resultadoMes = processo.resultados.get(index);
      // Calcula a média do mês para este processo e arredonda
      objResultado[mes] = resultadoMes && resultadoMes.count > 0 ? Math.round((resultadoMes.soma / resultadoMes.count) * 100) : null;
    });
    return objResultado;
  });

  // Formata os resultados mensais gerais
  const resultadosMensaisFormatados = meses.map((mes, index) => {
    const resultadoMesGeral = resultadosMensaisTabela.get(index);
    // Calcula a média geral do mês e arredonda
    const media = resultadoMesGeral && resultadoMesGeral.count > 0 ? Math.round((resultadoMesGeral.soma / resultadoMesGeral.count) * 100) : null;
    return {
      mes: `${mes.toUpperCase()}/${anoStr}`, // Formato JAN/25
      resultado: media
    };
  });

  return {
    processos: processosFormatados,
    resultadosMensais: resultadosMensaisFormatados
  };
};
// --- FIM DA FUNÇÃO CORRIGIDA ---


const dataAuditoriaPorCliente = async (clienteId) => {
  const anos = await AuditoriasModel.dataAuditoriaPorCliente(clienteId);
  return anos;
};

module.exports = {
  iniciarAuditoria,
  salvarProgressoAuditoria,
  finalizarAuditoria,
  listaAuditorias,
  listaAuditoriaPorID,
  listarDashboard,
  dataAuditoriaPorCliente
};
