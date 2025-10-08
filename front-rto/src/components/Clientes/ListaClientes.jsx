import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCirclePlus, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import api from '../../api/api';
import { toast } from 'react-toastify';
import '../../styles/Clientes/index.css';

const ListaClientes = ({ clientes, onNovo, onEditar, setClientes }) => {
  const [filtro, setFiltro] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInUseModal, setShowInUseModal] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);

  const handleExcluirClick = (cliente) => {
    setClienteParaExcluir(cliente);
    setShowDeleteModal(true);
  };

  const handleConfirmarExclusao = async () => {
    if (!clienteParaExcluir) return;

    try {
      await api.delete(`/clientes/${clienteParaExcluir.id}`);
      toast.success('Cliente excluído com sucesso!');
      setClientes(clientes.filter(c => c.id !== clienteParaExcluir.id));
    } catch (err) {
      if (err.response?.data?.mensagem?.includes('auditorias vinculadas')) {
        setShowInUseModal(true);
      } else {
        toast.error(err.response?.data?.mensagem || 'Erro ao excluir o cliente.');
      }
    } finally {
      setShowDeleteModal(false);
      setClienteParaExcluir(null);
    }
  };

  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente =>
      cliente.razao_social.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.cnpj.includes(filtro)
    );
  }, [clientes, filtro]);

  return (
    <div className="lista-clientes-container">
      <div className="toolbar">
        <input
          type="text"
          placeholder="Filtrar por nome ou CNPJ..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-input"
        />
        <button className="btn-criar-novo" onClick={onNovo}>
          <FontAwesomeIcon icon={faCirclePlus} /> Novo Cliente
        </button>
      </div>

      <div className="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Responsável</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map(cliente => (
                <tr key={cliente.id}>
                  <td data-label="Razão Social">{cliente.razao_social}</td>
                  <td data-label="CNPJ">{cliente.cnpj}</td>
                  <td data-label="Responsável">{cliente.responsavel}</td>
                  <td data-label="Ações" className="tabela-acoes">
                    <button
                      onClick={() => onEditar(cliente)}
                      className="btn-action btn-editar"
                      title="Editar Cliente"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleExcluirClick(cliente)}
                      className="btn-action btn-excluir"
                      title="Excluir Cliente"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Nenhum cliente encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir o cliente "{clienteParaExcluir?.razao_social}"?</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="btn-cancelar">Cancelar</button>
              <button onClick={handleConfirmarExclusao} className="btn-excluir">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {showInUseModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-aviso">
            <FontAwesomeIcon icon={faExclamationCircle} className="aviso-icon" />
            <h2>Ação Bloqueada</h2>
            <p>Este cliente não pode ser excluído, pois possui auditorias em seu histórico.</p>
            <div className="modal-actions">
              <button onClick={() => setShowInUseModal(false)} className="btn-ok">Entendido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaClientes;