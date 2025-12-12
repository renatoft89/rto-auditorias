import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import '../styles/GerenciarTopicosForm/index.css';

const GerenciarTopicosForm = ({ initialData, onSave, onCancel, topicosAtivos }) => {
  const [formData, setFormData] = useState(initialData);

  const opcoesDeOrdem = useMemo(() => {
    return topicosAtivos
      .map(t => t.ordem_topico)
      .sort((a, b) => a - b);
  }, [topicosAtivos]);

  const ultimaPosicao = opcoesDeOrdem.length > 0 ? opcoesDeOrdem[opcoesDeOrdem.length - 1] : 0;
  const isEditing = Boolean(formData?.is_editing);

  useEffect(() => {
    if (initialData?.is_editing) {
      setFormData(initialData);
    } else {
      setFormData({
        ...initialData,
        ordem_topico: ultimaPosicao + 1,
      });
    }
  }, [initialData, ultimaPosicao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const valorFinal = name === 'ordem_topico' ? parseInt(value, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: valorFinal }));
  };

  const handlePerguntaChange = (index, e) => {
    const { name, value } = e.target;
    const newPerguntas = [...(formData.perguntas || [])];
    newPerguntas[index] = { ...newPerguntas[index], [name]: value };
    setFormData((prev) => ({ ...prev, perguntas: newPerguntas }));
  };

  const addPergunta = () => {
    setFormData((prev) => ({
      ...prev,
      perguntas: [...(prev.perguntas || []), { descricao_pergunta: '', ordem_pergunta: (prev.perguntas?.length || 0) + 1 }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ordem_topico) {
      toast.error("Por favor, selecione a ordem do tópico.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="formulario-edicao-topico">
      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label>Nome do Tópico</label>
          <input
            type="text"
            name="nome_tema"
            value={formData?.nome_tema || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="campo">
          <label>Ordem do Tópico</label>
          <select
            name="ordem_topico"
            value={formData?.ordem_topico || ''}
            onChange={isEditing ? handleChange : undefined}
            disabled={!isEditing}
            required
          >
            {isEditing
              ? opcoesDeOrdem.map((ordem) => (
                  <option key={ordem} value={ordem}>
                    Posição {ordem}
                  </option>
                ))
              : formData?.ordem_topico && (
                  <option value={formData.ordem_topico}>
                    Posição {formData.ordem_topico}
                  </option>
                )}
          </select>
        </div>

        <div className="campo">
          <label>Requisitos</label>
          <textarea
            name="requisitos"
            value={formData?.requisitos || ''}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>
        <div className="perguntas-container">
          <h4>Perguntas:</h4>
          {(formData?.perguntas || []).map((pergunta, index) => (
            <div key={index} className="pergunta-campo">
              <label>Pergunta {index + 1}</label>
              <input
                type="text"
                name="descricao_pergunta"
                value={pergunta.descricao_pergunta}
                onChange={(e) => handlePerguntaChange(index, e)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addPergunta} className="btn-adicionar-pergunta">
            Adicionar Pergunta
          </button>
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancelar">Cancelar</button>
          <button type="submit" className="btn-salvar">Salvar Tópico</button>
        </div>
      </form>
    </div>
  );
};

export default GerenciarTopicosForm;