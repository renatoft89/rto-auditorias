import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import logo from '../assets/logo3.png';
import api from '../api/api';

import '../styles/Login/index.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const MIN_PASSWORD = 6;
    const REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/gm;

    if (!formData.email.trim()) {
      newErrors.email = 'O campo e-mail é obrigatório.';
    } else if (!REGEX.test(formData.email)) {
      newErrors.email = 'O e-mail deve ser um endereço válido.';
    }

    if (!formData.senha.trim()) {
      newErrors.senha = 'O campo senha é obrigatório.';
    } else if (formData.senha.length < MIN_PASSWORD) {
      newErrors.senha = `A senha deve ter no mínimo ${MIN_PASSWORD} caracteres.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/usuarios/login', formData);

      // Se a requisição foi um sucesso
      if (response.data.usuario) {
        const { token, ...userData } = response.data.usuario;

        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        navigate('/');

        // Exibe uma notificação de sucesso
        toast.success('Login bem-sucedido!');

      } else if (response.data.mensagem) {
        // Se a requisição retornou uma mensagem de erro
        toast.error(response.data.mensagem);

      } else {
        // Caso a resposta não se encaixe nos padrões acima
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
      }

    } catch (error) {
      // Trata erros de requisição, como problemas de rede ou status 400
      const errorMessage = error.response?.data?.mensagem || 'Erro na requisição. Verifique sua conexão ou tente mais tarde.';
      toast.error(errorMessage);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container-form">
        <form onSubmit={handleSubmit} className="login-form">
          <img src={logo} alt="Logo Consultech" className="login-logo" />
          <h1 className="login-main-title">Consultech</h1>
          <h2 className="login-sub-title">Gestão de Cozinhas</h2>

          {apiError && <p className="login-api-error">{apiError}</p>}

          <div className="login-field">
            <label htmlFor="email">Usuário*</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? 'login-input-error' : ''}
            />
            {errors.email && <span className="login-error-message">{errors.email}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="senha">Senha*</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              className={errors.senha ? 'login-input-error' : ''}
            />
            {errors.senha && <span className="login-error-message">{errors.senha}</span>}
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;