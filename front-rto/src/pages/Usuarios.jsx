import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';
import PageCabecalho from '../components/Botoes/PageCabecalho';
import ListaUsuarios from '../components/Usuarios/ListaUsuarios';
import UsuarioForm from '../components/Usuarios/UsuarioForm';

const Usuarios = () => {
  const [view, setView] = useState('lista');
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    tipo_usuario: 'AUD',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (err) {
      toast.error('Falha ao carregar a lista de usuários.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'lista') {
      fetchUsuarios();
    }
  }, [view, fetchUsuarios]);

  const handleNovo = () => {
    setFormData({
      nome: '',
      email: '',
      cpf: '',
      senha: '',
      tipo_usuario: 'AUD',
    });
    setView('criar');
  };

  const handleEditar = (usuario) => {
    setFormData(usuario);
    setView('editar');
  };

  const handleVoltarParaLista = () => {
    setView('lista');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const apiCall = view === 'criar'
      ? api.post('/usuarios', formData)
      : api.put(`/usuarios/${formData.id}`, formData);

    try {
      await apiCall;
      toast.success(`Usuário ${view === 'criar' ? 'cadastrado' : 'atualizado'} com sucesso!`);
      setView('lista');
    } catch (error) {           
      const errorMessage = error.response.data.mensagem || `Não foi possível ${view === 'criar' ? 'cadastrar' : 'atualizar'} o usuário.`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (view === 'lista') {
      return (
        <ListaUsuarios
          usuarios={usuarios}
          onNovo={handleNovo}
          onEditar={handleEditar}
          setUsuarios={setUsuarios}
        />
      );
    }
    
    return (
      <UsuarioForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText={view === 'criar' ? 'Cadastrar Usuário' : 'Salvar Alterações'}
        isEditing={view === 'editar'}
      />
    );
  };
  
  const getTitle = () => {
    if (view === 'criar') return 'Novo Usuário';
    if (view === 'editar') return 'Editar Usuário';
    return 'Gerenciar Usuários';
  }

  return (
    <div className="gerenciar-usuarios-page">
      <PageCabecalho 
        title={getTitle()}
        backTo="/administracao"
        showBack={view === 'lista'}
        onBackClick={view !== 'lista' ? handleVoltarParaLista : null}
      />
      {loading && view === 'lista' ? <p>Carregando...</p> : renderContent()}
    </div>
  );
};

export default Usuarios;