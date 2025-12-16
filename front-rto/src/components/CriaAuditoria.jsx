import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';
import PageCabecalho from './Botoes/PageCabecalho';
import LoadingIndicator from './LoadingIndicator';
import { useAuth } from '../contexts/AuthContext.jsx';

import '../styles/CriaAuditoria/index.css';

const CriaAuditoria = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [clientes, setClientes] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isResolvingConflict, setIsResolvingConflict] = useState(false);
  const [error, setError] = useState(null);
  const [showCompetenciaModal, setShowCompetenciaModal] = useState(false);
  const [payloadPendente, setPayloadPendente] = useState(null);
  const [dadosAuditoria, setDadosAuditoria] = useState({
    tipoAuditoria: '',
    auditorResponsavel: '',
    dataInicio: '',
    observacoes: '',
  });

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/clientes');
        setClientes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setError('Não foi possível carregar a lista de clientes.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientes();

    if (userData) {
      setDadosAuditoria((prev) => ({
        ...prev,
        auditorResponsavel: userData.nome,
      }));
    }
  }, [userData]);

  const handleEmpresaChange = (e) => {
    const clienteId = e.target.value;
    const clienteSelecionado = clientes.find((c) => c.id === parseInt(clienteId));
    setEmpresaSelecionada(clienteSelecionado || null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosAuditoria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!empresaSelecionada) {
      toast.error('Por favor, selecione uma empresa.');
      return;
    }
    if (!dadosAuditoria.dataInicio) {
        toast.error('Por favor, informe a data de início.');
        return;
    }

    setIsStarting(true);

    const payload = {
      cliente: empresaSelecionada,
      auditoria: {
        tipoAuditoria: dadosAuditoria.tipoAuditoria,
        auditorResponsavel: dadosAuditoria.auditorResponsavel,
        dataInicio: dadosAuditoria.dataInicio,
        observacao_geral: dadosAuditoria.observacoes,
      },
    };

    try {
      const response = await api.post('/auditorias/iniciar', payload);

      if (response?.data?.requiresConfirmation) {
        setPayloadPendente(payload);
        setShowCompetenciaModal(true);
        setIsStarting(false);
        return;
      }

      const newAuditId = response.data.auditoria.id;
      toast.success('Auditoria iniciada com sucesso!');
      navigate(`/auditorias/${newAuditId}`);
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Ocorreu um erro ao iniciar a auditoria');
      setIsStarting(false);
    }
  };

  const handleCloseCompetenciaModal = () => {
    if (isResolvingConflict) {
      return;
    }
    setShowCompetenciaModal(false);
    setPayloadPendente(null);
  };

  const handleConfirmarCancelarAnteriorESeguir = async () => {
    if (!payloadPendente) {
      toast.error('Não foi possível continuar. Refaça o início da auditoria.');
      setShowCompetenciaModal(false);
      return;
    }

    setIsResolvingConflict(true);
    try {
      const response = await api.post('/auditorias/iniciar', {
        ...payloadPendente,
        forceCancelPrevious: true,
      });
      const newAuditId = response.data.auditoria.id;
      toast.success('Auditoria iniciada com sucesso!');
      navigate(`/auditorias/${newAuditId}`);
      setShowCompetenciaModal(false);
      setPayloadPendente(null);
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Ocorreu um erro ao iniciar a auditoria');
    } finally {
      setIsResolvingConflict(false);
      setIsStarting(false);
    }
  };

  const handleRedirectToCadastro = () => {
    navigate('/administracao/clientes');
  };

  if (isLoading) {
    return (
      <div className="cria-auditoria-container">
        <LoadingIndicator message="Carregando clientes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="cria-auditoria-container error-state">
        <h2>Erro ao Carregar</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="cria-auditoria-container">
      <PageCabecalho
        title="Criar Auditoria"
        backTo="/"
      />

      <form onSubmit={handleSubmit}>
        <section className="selecao-empresa">
          <h2>Selecione a Empresa</h2>
          {clientes.length > 0 ? (
            <div className="campo">
              <select
                id="empresa"
                name="empresa"
                onChange={handleEmpresaChange}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  -- Escolha um cliente --
                </option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.razao_social} ({cliente.cnpj})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="campo-vazio">
              <p>Nenhum Cliente cadastrado.</p>
              <button
                type="button"
                className="btn-enviar"
                onClick={handleRedirectToCadastro}
              >
                Cadastrar Cliente
              </button>
            </div>
          )}
        </section>

        {empresaSelecionada && (
          <>
            <div className="dados-empresa">
              <h2>Empresa: {empresaSelecionada.razao_social}</h2>
              <p className="info-cnpj">
                <strong>CNPJ:</strong> {empresaSelecionada.cnpj}
              </p>
            </div>

            <div className="campo">
              <label htmlFor="tipoAuditoria">Serviços</label>
              <input
                type="text"
                id="tipoAuditoria"
                name="tipoAuditoria"
                value={dadosAuditoria.tipoAuditoria}
                onChange={handleInputChange}
              />
            </div>

            <div className="campo">
              <label htmlFor="auditorResponsavel">Auditor Responsável*</label>
              <input
                type="text"
                id="auditorResponsavel"
                name="auditorResponsavel"
                value={dadosAuditoria.auditorResponsavel}
                readOnly
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="dataInicio">Data de Início*</label>
              <input
                type="date"
                id="dataInicio"
                name="dataInicio"
                value={dadosAuditoria.dataInicio}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="observacoes">Observações Gerais</label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={dadosAuditoria.observacoes}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <button type="submit" className="btn-enviar" disabled={isStarting}>
              {isStarting ? 'Iniciando...' : 'Iniciar Auditoria'}
            </button>
          </>
        )}
      </form>

      {showCompetenciaModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Atenção!</h2>
            <p>
              Já existe uma validação dentro do mês de competência. Você deseja cancelar a anterior e seguir com uma nova?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                onClick={handleCloseCompetenciaModal}
                className="btn-cancelar"
                disabled={isResolvingConflict}
              >
                Manter Auditoria
              </button>
              <button
                type="button"
                onClick={handleConfirmarCancelarAnteriorESeguir}
                className="btn-excluir"
                disabled={isResolvingConflict}
              >
                {isResolvingConflict ? 'Cancelando...' : 'Cancelar Auditoria'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriaAuditoria;