import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/CadastroClientes/index.css'; // O CSS continua o mesmo

// Antes de usar, instale a biblioteca de ícones:
// npm install react-icons

const CadastroClientes = () => {
  // O estado agora reflete a estrutura da tabela 'clientes'
  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você enviaria os dados (formData) para a sua API,
    // que por sua vez salvaria no banco de dados.
    console.log('Dados para salvar na tabela clientes:', formData);
    alert('Cliente cadastrado com sucesso! (Verifique o console)');
  };

  return (
    <div className="container">
      <header className="topo">
        <div className="voltar-wrapper">
          {/* O link pode ser ajustado para a rota da sua aplicação */}
          <a href="/" className="voltar">
            <FaArrowLeft /> Voltar
          </a>
        </div>
        <h1>Cadastrar Novo Cliente</h1>
      </header>
      
      <form id="formCadastroCliente" onSubmit={handleSubmit}>
        {/* Campo para razao_social */}
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
          />
        </div>

        {/* Campo para cnpj */}
        <div className="campo">
          <label htmlFor="cnpj">CNPJ*</label>
          <input
            type="text"
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            required
            maxLength="18"
          />
        </div>

        <button type="submit" className="btn-enviar">
          Cadastrar Cliente
        </button>
      </form>
    </div>
  );
};

export default CadastroClientes;
