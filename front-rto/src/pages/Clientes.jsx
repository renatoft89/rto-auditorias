import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';

import ListaClientes from '../components/Clientes/ListaClientes';
import ClienteForm from '../components/Clientes/ClienteForm';
import PageCabecalho from '../components/Botoes/PageCabecalho';

const Clientes = () => {
  const [view, setView] = useState('lista');
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
    responsavel: '',
    email: '',
    telefone: '',
    endereco: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (err) {
      toast.error('Falha ao carregar a lista de clientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'lista') {
      fetchClientes();
    }
  }, [view, fetchClientes]);

  const handleNovo = () => {
    setFormData({
      razao_social: '',
      cnpj: '',
      responsavel: '',
      email: '',
      telefone: '',
      endereco: '',
    });
    setView('criar');
  };

  const handleEditar = (cliente) => {
    setFormData(cliente);
    setView('editar');
  };

  const handleVoltarParaLista = () => {
    setView('lista');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const apiCall = view === 'criar'
      ? api.post('/clientes', formData)
      : api.put(`/clientes/${formData.id}`, formData);

    try {
      await apiCall;
      toast.success(`Cliente ${view === 'criar' ? 'cadastrado' : 'atualizado'} com sucesso!`);
      setView('lista');
    } catch (error) {      
      const errorResponse = error.response?.data;
      const validationErrors = Array.isArray(errorResponse?.erros) ? errorResponse.erros : null;
      const errorMessage =
        validationErrors?.[0] ||
        errorResponse?.mensagem ||
        error.message ||
        `Não foi possível ${view === 'criar' ? 'cadastrar' : 'atualizar'} o cliente.`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (view === 'lista') {
      return (
        <ListaClientes
          clientes={clientes}
          onNovo={handleNovo}
          onEditar={handleEditar}
          setClientes={setClientes}
        />
      );
    }

    return (
      <div className="container-formulario">
        <ClienteForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitText={view === 'criar' ? 'Cadastrar Cliente' : 'Salvar Alterações'}
        />
      </div>
    );
  };
  
  const getTitle = () => {
    if (view === 'criar') return 'Novo Cliente';
    if (view === 'editar') return 'Editar Cliente';
    return 'Gerenciar Clientes';
  }

  return (
    <div className="gerenciar-clientes-page">
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

export default Clientes;
