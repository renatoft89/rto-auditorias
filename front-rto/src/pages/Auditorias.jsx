import React from 'react';
import { useAuditoria } from '../hooks/useAuditoria';
import { usePdfGenerator } from '../hooks/usePdfGenerator';

import AuditoriasLoading from '../components/Auditoria/AuditoriasLoading';
import AuditoriaConcluida from '../components/Auditoria/AuditoriaConcluida';
import AuditoriaTopicos from '../components/Auditoria/AuditoriaTopicos';
import AuditoriaPerguntas from '../components/Auditoria/AuditoriaPerguntas';
import AuditoriaNavegacao from '../components/Auditoria/AuditoriaNavegação';
import CabecalhoAuditoria from '../components/CabecalhoAuditoria';

import '../styles/Auditorias/index.css';

const Auditorias = () => {
  const {
    topicos,
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
    respostas,
    empresaInfo,
    auditoriaInfo,
    handleRespostaChange,
    handleNext,
    handleBack,
  } = useAuditoria();

  const { generatePdf } = usePdfGenerator();

  if (isLoading) {
    return <AuditoriasLoading />;
  }

  if (saveMessage === 'Auditoria salva com sucesso!') {
    const handleGerarPdf = () => generatePdf(topicos, respostas, empresaInfo, auditoriaInfo);
    return <AuditoriaConcluida onGerarPdf={handleGerarPdf} />;
  }

  if (topicos.length === 0) {
    return (
      <div className="auditorias-page">
        <p>Nenhum tópico de auditoria encontrado.</p>
      </div>
    );
  }

  return (
    <div className="auditorias-page">
      <CabecalhoAuditoria />
      <div className="global-progress-bar">
        <div className="global-progress-bar-fill" style={{ width: `${progressoGeral}%` }}></div>
      </div>

      <div className="auditorias-container">
        <div className="auditoria-card">
          <AuditoriaTopicos
            topico={currentTopic}
            indiceTopico={activeTopicIndex}
            totalTopicos={topicos.length}
            progressoTopico={progressoDoTopico}
          />
          <hr className="divider" />
          <AuditoriaPerguntas
            pergunta={currentQuestion}
            respostaSelecionada={respostas[currentQuestion.id]}
            onRespostaChange={handleRespostaChange}
          />
          <AuditoriaNavegacao
            onVoltar={handleBack}
            onAvancar={handleNext}
            voltarDesabilitado={activeTopicIndex === 0 && activeQuestionIndex === 0}
            avancarDesabilitado={isButtonDisabled}
            textoBotaoAvancar={buttonText}
            salvando={isSaving}
            indicePergunta={activeQuestionIndex}
            totalPerguntas={currentTopic.perguntas.length}
          />

          {resultadoParcialTopico && (
            <div className="resultado-parcial-container" style={{ backgroundColor: resultadoParcialTopico.cor }}>
              <div className="resultado-parcial-conteudo">
                <span className="resultado-classificacao">{resultadoParcialTopico.classificacao}</span>
                <span className="resultado-percentual">{resultadoParcialTopico.percentual}%</span>
              </div>
            </div>
          )}
          {saveMessage && <div className="save-message"><span>{saveMessage}</span></div>}
        </div>
      </div>
    </div>
  );
};

export default Auditorias;