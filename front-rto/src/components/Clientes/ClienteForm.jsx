import React from 'react';

const ClienteForm = ({ formData, setFormData, handleSubmit, isSubmitting, submitText }) => {

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
    setFormData((prevData) => ({ ...prevData, cnpj: value.slice(0, 18) }));
  };

  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{4,5})(\d)/, '$1-$2');
    setFormData((prevData) => ({ ...prevData, telefone: value.slice(0, 15) }));
  };

  return (
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
          autoComplete="organization"
        />
      </div>

      <div className="campo-duplo">
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
            autoComplete="on"
          />
        </div>
        <div className="campo">
          <label htmlFor="responsavel">Responsável*</label>
          <input
            type="text"
            id="responsavel"
            name="responsavel"
            value={formData.responsavel}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>
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
            autoComplete="email"
          />
        </div>
        <div className="campo">
          <label htmlFor="telefone">Telefone*</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleTelefoneChange}
            placeholder="(00) 00000-0000"
            required
            maxLength="15"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="campo">
        <label htmlFor="endereco">Endereço (Rua e Número)*</label>
        <input
          type="text"
          id="endereco"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          required
          maxLength="255"
          autoComplete="street-address"
        />
      </div>

      <button type="submit" className="btn-enviar" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : submitText}
      </button>
    </form>
  );
};

export default ClienteForm;
