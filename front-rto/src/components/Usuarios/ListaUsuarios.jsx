import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCirclePlus, faKey } from '@fortawesome/free-solid-svg-icons';
import api from '../../api/api';
import { toast } from 'react-toastify';
import '../../styles/Usuarios/index.css';
import AlterarSenhaModal from './AlterarSenhaModal';

const ListaUsuarios = ({ usuarios, onNovo, onEditar, setUsuarios }) => {
  const [filtro, setFiltro] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSenhaModal, setShowSenhaModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const handleExcluirClick = (usuario) => {
    setUsuarioSelecionado(usuario);
    setShowDeleteModal(true);
  };

  const handleAlterarSenhaClick = (usuario) => {
    setUsuarioSelecionado(usuario);
    setShowSenhaModal(true);
  };

  const handleConfirmarExclusao = async () => {
    if (!usuarioSelecionado) return;
    try {
      await api.delete(`/usuarios/${usuarioSelecionado.id}`);
      toast.success('Usuário excluído com sucesso!');
      setUsuarios(usuarios.filter(u => u.id !== usuarioSelecionado.id));
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Erro ao excluir o usuário.');
    } finally {
      setShowDeleteModal(false);
      setUsuarioSelecionado(null);
    }
  };

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [usuarios, filtro]);

  return (
    <div className="lista-usuarios-container">
      <div className="toolbar">
        <input
          type="text"
          placeholder="Filtrar por nome ou e-mail..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-input"
        />
        <button className="btn-criar-novo" onClick={onNovo}>
          <FontAwesomeIcon icon={faCirclePlus} /> Novo Usuário
        </button>
      </div>

      <div className="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>CPF</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map(usuario => (
                <tr key={usuario.id}>
                  <td data-label="Nome">{usuario.nome}</td>
                  <td data-label="E-mail">{usuario.email}</td>
                  <td data-label="CPF">{usuario.cpf}</td>
                  <td data-label="Tipo">{usuario.tipo_usuario}</td>
                  <td data-label="Ações" className="tabela-acoes">
                    <button
                      onClick={() => onEditar(usuario)}
                      className="btn-action btn-editar"
                      title="Editar Usuário"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleAlterarSenhaClick(usuario)}
                      className="btn-action btn-senha"
                      title="Alterar Senha"
                    >
                      <FontAwesomeIcon icon={faKey} />
                    </button>
                    <button
                      onClick={() => handleExcluirClick(usuario)}
                      className="btn-action btn-excluir"
                      title="Excluir Usuário"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir o usuário "{usuarioSelecionado?.nome}"?</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="btn-cancelar">Cancelar</button>
              <button onClick={handleConfirmarExclusao} className="btn-excluir">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {showSenhaModal && (
        <AlterarSenhaModal 
          usuario={usuarioSelecionado} 
          onClose={() => setShowSenhaModal(false)} 
        />
      )}
    </div>
  );
};

export default ListaUsuarios;