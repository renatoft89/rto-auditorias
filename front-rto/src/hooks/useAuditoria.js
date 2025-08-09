import { useState, useEffect, useMemo } from 'react';
import api from '../api/api';

const idUsuarioExemplo = 1;
const idClienteExemplo = 1;

const LOCAL_STORAGE_RESPOSTAS_KEY = 'auditoria-respostas-em-andamento';
const LOCAL_STORAGE_POSICAO_KEY = 'auditoria-posicao-em-andamento';

export const useAuditoria = () => {
  // Inicializa o estado com dados do localStorage, se houver
  const [topicos, setTopicos] = useState([]);
  const [respostas, setRespostas] = useState(() => {
    try {
      const savedRespostas = localStorage.getItem(LOCAL_STORAGE_RESPOSTAS_KEY);
      return savedRespostas ? JSON.parse(savedRespostas) : {};
    } catch (error) {
      console.error('Erro ao carregar respostas do localStorage:', error);
      return {};
    }
  });

  //Inicializa a posição com dados do localStorage, se houver
  const [activeTopicIndex, setActiveTopicIndex] = useState(() => {
    try {
      const savedPosition = localStorage.getItem(LOCAL_STORAGE_POSICAO_KEY);
      return savedPosition ? JSON.parse(savedPosition).activeTopicIndex : 0;
    } catch (error) {
      console.error('Erro ao carregar posição do localStorage:', error);
      return 0;
    }
  });
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(() => {
    try {
      const savedPosition = localStorage.getItem(LOCAL_STORAGE_POSICAO_KEY);
      return savedPosition ? JSON.parse(savedPosition).activeQuestionIndex : 0;
    } catch (error) {
      console.error('Erro ao carregar posição do localStorage:', error);
      return 0;
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Efeito para salvar as respostas no localStorage a cada alteração
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_RESPOSTAS_KEY, JSON.stringify(respostas));
    } catch (error) {
      console.error('Erro ao salvar respostas no localStorage:', error);
    }
  }, [respostas]);

  // Efeito para salvar a posição no localStorage a cada alteração
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_POSICAO_KEY, JSON.stringify({ activeTopicIndex, activeQuestionIndex }));
    } catch (error) {
      console.error('Erro ao salvar posição no localStorage:', error);
    }
  }, [activeTopicIndex, activeQuestionIndex]);

  useEffect(() => {
    const fetchTopicos = async () => {
      try {
        const response = await api.get('/topicos/com-perguntas');
        console.log(response);
        
        setTopicos(response.data);
      } catch (error) {
        console.error('Erro ao buscar tópicos:', error);
        setSaveMessage('Erro ao carregar tópicos. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopicos();
  }, []);

  const handleRespostaChange = (perguntaId, valor) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaId]: valor,
    }));
  };

const handleSubmitAudit = async () => {
  setIsSaving(true);
  setSaveMessage('Salvando auditoria...');

  try {
    const clienteStorage = localStorage.getItem('empresaSelecionanda');
    
    let idClienteFinal = idClienteExemplo;
    if (clienteStorage) {
      try {
        const parsed = JSON.parse(clienteStorage);
        
        if (parsed?.cliente?.id) {
          idClienteFinal = parsed.cliente.id;
        }
      } catch (e) {
        console.error('Erro ao fazer parse:', e);
      }
    }

    const dataAuditoria = {
      auditoriaData: {
        id_usuario: idUsuarioExemplo, // ID do usuário que está realizando a auditoria
        id_cliente: idClienteFinal,
        observacao: 'Auditoria concluída.',
        dt_auditoria: new Date().toISOString().split('T')[0],
      },
      respostas: Object.keys(respostas).map(perguntaId => ({
        id_pergunta: parseInt(perguntaId),
        st_pergunta: respostas[perguntaId],
        comentario: ''
      })),
    };

    console.log('Dados Auditoria enviado:', dataAuditoria);

    await api.post('/auditorias', dataAuditoria);
    setSaveMessage('Auditoria salva com sucesso!');

    localStorage.removeItem(LOCAL_STORAGE_RESPOSTAS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_POSICAO_KEY);
  } catch (error) {
    console.error('Erro ao salvar auditoria:', error);
    setSaveMessage('Erro ao salvar auditoria. Tente novamente.');
  } finally {
    setIsSaving(false);
  }
};


  const handleNext = () => {
    const currentTopic = topicos[activeTopicIndex];
    const totalQuestionsInTopic = currentTopic.perguntas.length;
    const isLastQuestionInTopic = activeQuestionIndex === totalQuestionsInTopic - 1;
    const isLastTopic = activeTopicIndex === topicos.length - 1;

    if (isLastQuestionInTopic && isLastTopic) {
      handleSubmitAudit();
    } else if (activeQuestionIndex < totalQuestionsInTopic - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else if (activeTopicIndex < topicos.length - 1) {
      setActiveTopicIndex(prev => prev + 1);
      setActiveQuestionIndex(0);
    }
  };

  const handleBack = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
    } else if (activeTopicIndex > 0) {
      setActiveTopicIndex(prev => prev - 1);
      const prevTopic = topicos[activeTopicIndex - 1];
      setActiveQuestionIndex(prevTopic.perguntas.length - 1);
    }
  };

  const currentTopic = useMemo(() => topicos[activeTopicIndex], [topicos, activeTopicIndex]);
  const currentQuestion = useMemo(() => currentTopic?.perguntas[activeQuestionIndex], [currentTopic, activeQuestionIndex]);

  const progressoGeral = useMemo(() => {
    const totalPerguntasGeral = topicos.reduce((total, topico) => total + (topico.perguntas?.length || 0), 0);
    const totalPerguntasRespondidas = Object.keys(respostas).length;
    return totalPerguntasGeral > 0 ? Math.round((totalPerguntasRespondidas / totalPerguntasGeral) * 100) : 0;
  }, [topicos, respostas]);

  const progressoDoTopico = useMemo(() => {
    const perguntasDoTopico = currentTopic?.perguntas || [];
    const perguntasRespondidasDoTopico = perguntasDoTopico.filter(pergunta => respostas[pergunta.id]).length;
    return perguntasDoTopico.length > 0 ? Math.round((perguntasRespondidasDoTopico / perguntasDoTopico.length) * 100) : 0;
  }, [currentTopic, respostas]);

  const resultadoParcialTopico = useMemo(() => {
    if (!currentTopic || !respostas) {
      return null;
    }
    const perguntasDoTopico = currentTopic.perguntas || [];
    const respostasDoTopico = perguntasDoTopico.filter(p => respostas[p.id]);

    if (respostasDoTopico.length === 0) {
      return null;
    }

    const conformes = respostasDoTopico.filter(p => respostas[p.id] === 'CF').length;
    const percentual = Math.round((conformes / respostasDoTopico.length) * 100);

    let classificacao = '';
    let cor = '';

    if (percentual >= 80) {
      classificacao = 'Processos Satisfatórios';
      cor = 'var(--success-color)';
    } else if (percentual >= 50) {
      classificacao = 'Processos que podem gerar riscos';
      cor = 'var(--warning-color)';
    } else {
      classificacao = 'Processos Inaceitáveis';
      cor = 'var(--error-color)';
    }

    return { percentual, classificacao, cor };
  }, [currentTopic, respostas]);

  const isLastQuestion = useMemo(() => activeQuestionIndex === (currentTopic?.perguntas.length - 1), [activeQuestionIndex, currentTopic]);
  const isLastTopic = useMemo(() => activeTopicIndex === topicos.length - 1, [activeTopicIndex, topicos]);

  const buttonText = isLastQuestion && isLastTopic ? 'Enviar' : 'Avançar';
  const isButtonDisabled = !respostas[currentQuestion?.id] || isSaving;

  return {
    topicos,
    respostas,
    isLoading,
    isSaving,
    saveMessage,
    activeTopicIndex,
    activeQuestionIndex,
    currentTopic,
    currentQuestion,
    progressoGeral,
    progressoDoTopico,
    resultadoParcialTopico,
    buttonText,
    isButtonDisabled,
    handleRespostaChange,
    handleNext,
    handleBack,
  };
};