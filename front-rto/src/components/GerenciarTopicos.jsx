import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faCirclePlus,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import PageCabecalho from '../components/Botoes/PageCabecalho';
import api from '../api/api';
import GerenciarTopicosForm from '../components/GerenciarTopicosForm';

import '../styles/GerenciarTopicos/index.css';

const GerenciarTopicos = () => {
  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);

  const fetchTopicos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/topicos/com-perguntas?status=todos');
      setTopicos(response.data);
    } catch (err) {
      console.error("Erro ao carregar tópicos:", err);
      toast.error('Falha ao carregar a lista de tópicos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFormVisible) {
      fetchTopicos();
    }
  }, [fetchTopicos, isFormVisible]);

  const toggleExpand = (id) => {
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteTopic = async () => {
    if (!topicToDelete) return;
    try {
      await api.delete(`/topicos/${topicToDelete.id}`);
      toast.success('Tópico excluído com sucesso!');
      fetchTopicos();
    } catch (err) {
      console.error("Erro ao excluir o tópico:", err);
      toast.error(err.response?.data?.message || 'Erro ao excluir o tópico.');
    } finally {
      setShowDeleteModal(false);
      setTopicToDelete(null);
    }
  };

  const handleToggleActive = async (id, type, isActive) => {
    try {
      const endpoint = type === 'topico' ? `/topicos/status/${id}` : `/perguntas/status/${id}`;
      const newStatus = { isActive: !isActive };
      await api.put(endpoint, newStatus);

      toast.success(`${type === 'topico' ? 'Tópico' : 'Pergunta'} ${isActive ? 'desativado(a)' : 'ativado(a)'} com sucesso!`);
      fetchTopicos();
    } catch (err) {
      console.error(`Erro ao alternar o status de ${type}:`, err);
      toast.error(err.response?.data?.message || `Falha ao ${isActive ? 'desativar' : 'ativar'} o(a) ${type}.`);
    }
  };

  const handleEdit = (topico) => {
    setFormData({
      ...topico,
      topico_id_original: topico.id,
      is_editing: true
    });
    setIsFormVisible(true);
  };

  const handleNovoTopico = () => {
    setFormData({
      nome_tema: '',
      requisitos: '',
      perguntas: [{ descricao_pergunta: '', ordem_pergunta: 1 }],
      is_active: 1,
      is_editing: false,
    });
    setIsFormVisible(true);
  };

 const handleSaveForm = async (data) => {
  
  const {nome_tema, requisitos, perguntas, ordem_topico, topico_id_original} = data
  
  const payload = {
    nome_tema,
    requisitos,
    perguntas,
    ordem_topico,
    topico_id_original,
  };

  const endpoint = data.is_editing ? '/topicos/salvar-edicao' : '/topicos';

  try {    
    const response = await api.post(endpoint, payload);
    toast.success(response.data.message || 'Tópico salvo com sucesso!');
    setIsFormVisible(false);
    setFormData(null);
  } catch (err) {
    console.error("Erro ao salvar o tópico:", err);
    const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao salvar.';
    toast.error(errorMessage);
  }
};

  if (isFormVisible) {
    return (
      <GerenciarTopicosForm
        key={formData?.id || 'novo-topico'}
        initialData={formData}
        onSave={handleSaveForm}
        onCancel={() => {
          setIsFormVisible(false);
          setFormData(null);
        }}
        topicosAtivos={topicos.filter(t => t.is_active)}
      />
    );
  }

  return (
    <div className="gerenciar-topicos-page">
      <PageCabecalho title="Gerenciar Tópicos e Perguntas" backTo="/administracao" />
      <div className="container-opcoes">
        <button className="btn-criar-novo" onClick={handleNovoTopico}>
          <FontAwesomeIcon icon={faCirclePlus} /> Novo Tópico
        </button>
      </div>
      {topicos.length > 0 ? (
        <ul className="lista-topicos">
          {topicos.map(topico => (
            <li key={topico.id} className="topico-item">
              <div className="topico-header">
                <span className="topico-title">{topico.ordem_topico > 0 ? `${topico.ordem_topico} - ` : ''}{topico.nome_tema}</span>
                <div className="topico-actions-wrapper">
                  <span className={`status-badge ${topico.is_active ? 'ativo' : 'inativo'}`}>
                    {topico.is_active ? 'ATIVO' : 'INATIVO'}
                  </span>
                  {topico.is_deletable && (
                    <button
                      onClick={() => {
                        setTopicToDelete(topico);
                        setShowDeleteModal(true);
                      }}
                      className="btn-action icon-only btn-excluir"
                      title="Excluir Tópico"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleActive(topico.id, 'topico', topico.is_active)}
                    className={`btn-action icon-only ${topico.is_active ? 'btn-desativar' : 'btn-ativar'}`}
                    title={topico.is_active ? 'Desativar' : 'Ativar'}
                  >
                    <FontAwesomeIcon icon={topico.is_active ? faCircleXmark : faCircleCheck} />
                  </button>
                  <button onClick={() => handleEdit(topico)} className="btn-action icon-only btn-editar" title="Editar Tópico (Criar Nova Versão)">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => toggleExpand(topico.id)} className="btn-expandir">
                    <FontAwesomeIcon icon={expandedTopics[topico.id] ? faChevronUp : faChevronDown} />
                  </button>
                </div>
              </div>
              {expandedTopics[topico.id] && (
                <ul className="lista-perguntas">
                  {(topico.perguntas || []).map(pergunta => (
                    <li key={pergunta.id} className="pergunta-item">
                      <span className="pergunta-text">{pergunta.ordem_pergunta} - {pergunta.descricao_pergunta}</span>
                      <div className="pergunta-actions-wrapper">
                        <span className={`status-badge ${pergunta.is_active ? 'ativo' : 'inativo'}`}>
                          {pergunta.is_active ? 'ATIVO' : 'INATIVO'}
                        </span>
                        <button
                          onClick={() => handleToggleActive(pergunta.id, 'pergunta', pergunta.is_active)}
                          className={`btn-action icon-only ${pergunta.is_active ? 'btn-desativar' : 'btn-ativar'}`}
                          title={pergunta.is_active ? 'Desativar' : 'Ativar'}
                        >
                          <FontAwesomeIcon icon={pergunta.is_active ? faCircleXmark : faCircleCheck} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">Nenhum tópico encontrado.</p>
      )}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir o tópico "{topicToDelete?.nome_tema}"? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="btn-cancelar">Cancelar</button>
              <button onClick={handleDeleteTopic} className="btn-excluir">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciarTopicos;