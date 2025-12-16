const AuditoriasModel = require('../models/Auditorias.Model');
const ArquivosModel = require('../models/Arquivos.Model');
const TopicosSnapshotModel = require('../models/TopicosSnapshot.Model');
const PerguntasSnapshotModel = require('../models/PerguntasSnapshot.Model');
const connection = require('../database/connection');

const iniciarAuditoria = async (dados, usuario) => {
  const { cliente, auditoria } = dados;

  if (!cliente || !cliente.id || !auditoria || !usuario || !usuario.id) {
    throw new Error('Dados insuficientes para iniciar a auditoria.');
  }

  const forceCancelPrevious = Boolean(dados?.forceCancelPrevious || auditoria?.forceCancelPrevious);
  const auditoriaExistenteMesmoMes = await AuditoriasModel.buscarAuditoriaMesmoMes(
    cliente.id,
    auditoria.dataInicio
  );

  if (auditoriaExistenteMesmoMes) {
    if (forceCancelPrevious) {
      await AuditoriasModel.cancelarAuditoria(auditoriaExistenteMesmoMes.id);
    } else {
      return {
        requiresConfirmation: true,
        mensagem: 'Já existe uma validação dentro do mês de competência. Você deseja cancelar a anterior e seguir com uma nova?',
        codigo: 'AUDITORIA_MES_CONFLITO',
        conflito: auditoriaExistenteMesmoMes,
      };
    }
  }

  const auditoriaData = {
    id_usuario: usuario.id,
    id_cliente: cliente.id,
    observacao_geral: auditoria.observacao_geral || '',
    dt_auditoria: auditoria.dataInicio,
    st_auditoria: 'A',
  };

  const novaAuditoriaId = await AuditoriasModel.cadastrarAuditoria(auditoriaData);

  try {
    await criarSnapshotsAuditoria(novaAuditoriaId);
  } catch (error) {
    console.error('Erro ao criar snapshots da auditoria:', error);
    throw new Error(`Falha ao inicializar auditoria com snapshots: ${error.message}`);
  }

  return { id: novaAuditoriaId, ...auditoriaData };
};

const salvarProgressoAuditoria = async (id_auditoria, dadosResposta) => {

  const { id_pergunta, st_pergunta, comentario, fotos } = dadosResposta;

  const validStatus = ['CF', 'NC', 'PC', 'NE'];
  if (!id_auditoria || !id_pergunta || !st_pergunta || !validStatus.includes(st_pergunta)) {
    console.error('Validação falhou:', { id_auditoria, id_pergunta, st_pergunta });
    throw new Error('Dados de resposta incompletos ou inválidos para salvar o progresso.');
  }

  const [perguntaExistente] = await connection.query(
    'SELECT id FROM perguntas WHERE id = ?',
    [id_pergunta]
  );

  if (!perguntaExistente || perguntaExistente.length === 0) {
    console.error(`❌ Pergunta ${id_pergunta} não encontrada!`);
    throw new Error(`Pergunta com ID ${id_pergunta} não existe. Recarregue a página para atualizar os dados.`);
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

const cancelarAuditoria = async (id) => {
  const affectedRows = await AuditoriasModel.cancelarAuditoria(id);
  if (affectedRows === 0) {
    throw new Error('Auditoria não encontrada para cancelar.');
  }
  return { mensagem: 'Auditoria cancelada com sucesso!' };
};

const listaAuditorias = async () => {
  const auditorias = await AuditoriasModel.listaAuditorias();
  return auditorias;
};


const listaAuditoriaPorID = async (id_auditoria) => {
  const dados = await AuditoriasModel.listaAuditoriaPorID(id_auditoria);

  if (!dados || dados.length === 0) {
    console.warn(`Nenhum dado retornado do Model para auditoria ID: ${id_auditoria}`);
    return null;
  }

  const infoRow = dados[0];

  if (!infoRow.id_auditoria || !infoRow.id_cliente) {
    console.error(`Dados essenciais (id_auditoria, id_cliente) faltando na resposta do Model para auditoria ID: ${id_auditoria}`, infoRow);
    return null;
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
      responsavel: infoRow.cliente_responsavel,
      telefone: infoRow.cliente_telefone,
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
        ordem_topico: row.ordem_topico,
        perguntas: []
      });
    }
    if (!auditoria.topicos.get(row.topico_id).perguntas.some(p => p.id === row.pergunta_id)) {
      auditoria.topicos.get(row.topico_id).perguntas.push({
        id: row.pergunta_id,
        st_pergunta: row.st_pergunta
      });
    }
  });


  const auditoriasConsolidadas = Array.from(auditoriasAgrupadas.values());

  const processosTabela = new Map();
  const resultadosMensaisTabela = new Map();

  auditoriasConsolidadas.forEach(auditoria => {
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
          ordem_topico: topico.ordem_topico,
          resultados: new Map()
        });
      }
      const processo = processosTabela.get(topico.id);
      if (topico.nome_tema) {
        processo.nome_tema = topico.nome_tema;
      }

      if (
        topico.ordem_topico != null &&
        (processo.ordem_topico == null || topico.ordem_topico < processo.ordem_topico)
      ) {
        processo.ordem_topico = topico.ordem_topico;
      }

      let somaPontosTopico = 0;
      let perguntasConsideradasTopico = 0;

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
      });

      const percentualTopico = perguntasConsideradasTopico > 0 ? (somaPontosTopico / perguntasConsideradasTopico) : null;

      if (percentualTopico !== null) {
        if (!processo.resultados.has(mesIndex)) {
          processo.resultados.set(mesIndex, { soma: 0, count: 0 });
        }
        const resultadoMesTopico = processo.resultados.get(mesIndex);
        resultadoMesTopico.soma += percentualTopico;
        resultadoMesTopico.count++;

        somaPercentuaisAuditoria += percentualTopico;
        countTopicosAuditoria++;
      }
    });

    if (countTopicosAuditoria > 0) {
      const mediaAuditoria = somaPercentuaisAuditoria / countTopicosAuditoria;
      const resultadoMesGeral = resultadosMensaisTabela.get(mesIndex);
      resultadoMesGeral.soma += mediaAuditoria;
      resultadoMesGeral.count++;
    }
  });

  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const anoStr = String(ano).substring(2);
  const processosArray = Array.from(processosTabela.values());

  let maxOrdem = 0;
  processosArray.forEach((proc) => {
    if (proc.ordem_topico != null && !Number.isNaN(Number(proc.ordem_topico))) {
      const ordemNum = Number(proc.ordem_topico);
      if (ordemNum > maxOrdem) {
        maxOrdem = ordemNum;
      }
    }
  });

  let proximaOrdem = maxOrdem + 1;
  processosArray.forEach((proc) => {
    if (proc.ordem_topico == null) {
      proc.ordem_topico = proximaOrdem;
      proximaOrdem += 1;
    }
  });

  const processosFormatados = processosArray
    .sort((a, b) => {
      const ordemA = a.ordem_topico ?? Number.MAX_SAFE_INTEGER;
      const ordemB = b.ordem_topico ?? Number.MAX_SAFE_INTEGER;
      return ordemA - ordemB;
    })
    .map(processo => {
      const objResultado = {
        id: processo.id,
        nome_tema: processo.nome_tema,
        ordem_topico: processo.ordem_topico,
      };
      meses.forEach((mes, index) => {
        const resultadoMes = processo.resultados.get(index);
        objResultado[mes] = resultadoMes && resultadoMes.count > 0 ? Math.round((resultadoMes.soma / resultadoMes.count) * 100) : null;
      });
      return objResultado;
    });

  const resultadosMensaisFormatados = meses.map((mes, index) => {
    const resultadoMesGeral = resultadosMensaisTabela.get(index);
    const media = resultadoMesGeral && resultadoMesGeral.count > 0 ? Math.round((resultadoMesGeral.soma / resultadoMesGeral.count) * 100) : null;
    return {
      mes: `${mes.toUpperCase()}/${anoStr}`,
      resultado: media
    };
  });

  return {
    processos: processosFormatados,
    resultadosMensais: resultadosMensaisFormatados
  };
};


const dataAuditoriaPorCliente = async (clienteId) => {
  const anos = await AuditoriasModel.dataAuditoriaPorCliente(clienteId);
  return anos;
};

const criarSnapshotsAuditoria = async (id_auditoria) => {
  try {
    console.log(`Criando snapshots para auditoria ID: ${id_auditoria}`);

    const topicosSnapshotIds = await TopicosSnapshotModel.criarSnapshotTopicos(id_auditoria);
    console.log(`✓ ${topicosSnapshotIds.length} tópicos copiados para snapshot`);

    const perguntasSnapshotIds = await PerguntasSnapshotModel.criarSnapshotPerguntas(
      id_auditoria,
      topicosSnapshotIds
    );
    console.log(`✓ ${perguntasSnapshotIds.length} perguntas copiadas para snapshot`);

    return {
      id_auditoria,
      topicos_snapshot: topicosSnapshotIds.length,
      perguntas_snapshot: perguntasSnapshotIds.length,
      mensagem: 'Snapshots criados com sucesso'
    };
  } catch (error) {
    console.error('Erro ao criar snapshots da auditoria:', error);
    throw error;
  }
};

module.exports = {
  iniciarAuditoria,
  salvarProgressoAuditoria,
  finalizarAuditoria,
  cancelarAuditoria,
  listaAuditorias,
  listaAuditoriaPorID,
  listarDashboard,
  dataAuditoriaPorCliente,
  criarSnapshotsAuditoria
};
