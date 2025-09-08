import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageCabecalho from '../components/Botoes/PageCabecalho';
import api from '../api/api';
import { toast } from 'react-toastify';

import '../styles/CadastroUsuarios/index.css';

const CadastroUsuarios = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    tipo_usuario: 'AUD',
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

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1-$2');

    setFormData((prevData) => ({
      ...prevData,
      cpf: value.slice(0, 14),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.senha.trim()) newErrors.senha = true;
    if (formData.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = true;
    if (!formData.tipo_usuario) newErrors.tipo_usuario = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/usuarios', formData);
      toast.success(response.data.mensagem || 'Usuário cadastrado com sucesso!');
      setTimeout(() => {
        navigate('/');
      }, 3000);

      setFormData({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        tipo_usuario: 'AUD',
      });

      setErrors({});
    } catch (error) {
      let errorMessage = 'Não foi possível cadastrar o usuário. Tente novamente.';

      if (error.response && error.response.data) {
        if (error.response.data.mensagem) {
          errorMessage = error.response.data.mensagem;
        } else if (error.response.data.erros && error.response.data.erros.length > 0) {
          errorMessage = error.response.data.erros[0];
        }
      }

      toast.error(errorMessage);
      console.error('Erro na requisição:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cadastro-usuarios-container">
      <PageCabecalho
        title="Cadastrar Usuários"
        backTo="/"
      />
      <div className="container-formulario">
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="nome">Nome*</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              maxLength="150"
              style={{ border: errors.nome ? '2px solid red' : '1px solid #ccc' }}
            />
          </div>

          <div className="campo-duplo">
            <div className="campo">
              <label htmlFor="email">E-mail*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ border: errors.email ? '2px solid red' : '1px solid #ccc' }}
              />
            </div>
            <div className="campo">
              <label htmlFor="senha">Senha*</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                style={{ border: errors.senha ? '2px solid red' : '1px solid #ccc' }}
              />
            </div>
          </div>

          <div className="campo-duplo">
            <div className="campo">
              <label htmlFor="cpf">CPF*</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                required
                maxLength="14"
                style={{ border: errors.cpf ? '2px solid red' : '1px solid #ccc' }}
              />
            </div>
            <div className="campo">
              <label htmlFor="tipo_usuario">Tipo de Usuário*</label>
              <select
                id="tipo_usuario"
                name="tipo_usuario"
                value={formData.tipo_usuario}
                onChange={handleChange}
                required
                style={{ border: errors.tipo_usuario ? '2px solid red' : '1px solid #ccc' }}
              >
                <option value="AUD">AUD</option>
                <option value="ADM">ADM</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-enviar"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Usuário'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroUsuarios;
