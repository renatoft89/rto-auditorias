// src/components/CadastroClientes.jsx
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../api/api'; // 1. Importe a instância do axios
import '../styles/CadastroClientes/index.css';

const CadastroClientes = () => {
  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
  });
  const [errors, setErrors] = useState({});
  // Estado para feedback de carregamento
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCnpjChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    
    setFormData((prevData) => ({
        ...prevData,
        cnpj: value.slice(0, 18),
    }));
  };

  // 2. A função de submit agora é async
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.razao_social.trim()) newErrors.razao_social = true;
    if (formData.cnpj.replace(/\D/g, '').length !== 14) newErrors.cnpj = true; // Validação mais robusta

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert('Por favor, preencha os campos corretamente.');
      return;
    }
    
    setIsSubmitting(true); // Desabilita o botão

    // 3. Bloco try...catch para a requisição
    try {
      // O endpoint é '/clientes' porque a baseURL já contém '/api'
      const response = await api.post('/clientes', formData);

      console.log('Resposta da API:', response.data);
      alert('Cliente cadastrado com sucesso!');

      // Limpa o formulário
      setFormData({ razao_social: '', cnpj: '' });
      setErrors({});

    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      // Pega a mensagem de erro do backend, se houver (agora usando 'mensagem')
      const errorMessage = error.response?.data?.mensagem || 'Não foi possível cadastrar o cliente. Tente novamente.';
      alert(`Erro: ${errorMessage}`);
    } finally {
      setIsSubmitting(false); // Reabilita o botão
    }
  };

  return (
    <div className="container">
      <header className="topo">
        <div className="voltar-wrapper">
          <a href="/" className="voltar">
            <FaArrowLeft /> Voltar
          </a>
        </div>
        <h1>Cadastrar Novo Cliente</h1>
      </header>
      
      <form id="formCadastroCliente" onSubmit={handleSubmit} noValidate>
        <div className="campo">
          <label htmlFor="razao_social">Razão Social*</label>
          <input
            type="text"
            id="razao_social"
            name="razao_social"
            value={formData.razao_social}
            onChange={handleChange}
            required
            maxLength="150"
            style={{ border: errors.razao_social ? '2px solid red' : '1px solid #ccc' }}
          />
        </div>

        <div className="campo">
          <label htmlFor="cnpj">CNPJ*</label>
          <input
            type="text"
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleCnpjChange}
            placeholder="00.000.000/0000-00"
            required
            maxLength="18"
            style={{ border: errors.cnpj ? '2px solid red' : '1px solid #ccc' }}
          />
        </div>

        <button type="submit" className="btn-enviar" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Cliente'}
        </button>
      </form>
    </div>
  );
};

export default CadastroClientes;
