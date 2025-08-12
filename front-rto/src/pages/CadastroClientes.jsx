import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../api/api';
import { toast } from 'react-toastify'

import '../styles/CadastroClientes/index.css';

const CadastroClientes = () => {
  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
  });
  const [errors, setErrors] = useState({});
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.razao_social.trim()) newErrors.razao_social = true;
    if (formData.cnpj.replace(/\D/g, '').length !== 14) newErrors.cnpj = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Por favor, preencha os campos corretamente')
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/clientes', formData);
      toast.success(response.data.mensagem || 'Cliente cadastrado com sucesso!')

      setFormData({ razao_social: '', cnpj: '' });
      setErrors({});
    } catch (error) {
      let errorMessage = 'Não foi possível cadastrar o cliente. Tente novamente.';

      // Verifica se a resposta da API tem a propriedade 'data'
      if (error.response && error.response.data) {
        // Caso 1: A resposta tem a chave 'mensagem'
        if (error.response.data.mensagem) {
          errorMessage = error.response.data.mensagem;
        }
        // Caso 2: A resposta tem a chave 'erros' (um array)
        else if (error.response.data.erros && error.response.data.erros.length > 0) {
          errorMessage = error.response.data.erros[0];
        }
      }

      // Exibe a notificação com a mensagem de erro encontrada
      toast.error(errorMessage);

      // Opcional: Ainda é uma boa prática logar o erro completo para depuração
      console.error('Erro na requisição:', error);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cadastra-cliente-container">
      <header className="cliente-header">
        <a href="/" className="voltar">
          <FaArrowLeft /> Voltar
        </a>
        <h1>Cadastrar Cliente</h1>
        <div className="placeholder"></div>
      </header>

      <form onSubmit={handleSubmit}>
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