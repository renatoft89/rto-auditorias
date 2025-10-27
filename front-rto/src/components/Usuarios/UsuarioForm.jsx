import React from 'react';

const UsuarioForm = ({ formData, setFormData, handleSubmit, isSubmitting, submitText, isEditing = false }) => {

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
    setFormData((prevData) => ({ ...prevData, cpf: value.slice(0, 14) }));
  };

  return (
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
            autoComplete="name"
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
              autoComplete="email"
            />
          </div>
          {!isEditing && (
            <div className="campo">
              <label htmlFor="senha">Senha*</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          )}
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
            >
              <option value="AUD">Auditor</option>
              <option value="ADM">Administrador</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-enviar" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : submitText}
        </button>
      </form>
    </div>
  );
};

export default UsuarioForm;
