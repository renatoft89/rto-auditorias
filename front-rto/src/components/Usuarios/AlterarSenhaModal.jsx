import { useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-toastify';

const AlterarSenhaModal = ({ usuario, onClose }) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (novaSenha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.patch(`/usuarios/senha/${usuario.id}`, { novaSenha });
      toast.success('Senha alterada com sucesso!');
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.mensagem || 'Não foi possível alterar a senha.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={usuario.email || ''}
            autoComplete="username"
            style={{ display: 'none' }}
            readOnly
          />
          <h2>Alterar Senha</h2>
          <p>Alterando a senha para o usuário: <strong>{usuario.nome}</strong></p>

          <div className="campo">
            <label htmlFor="novaSenha">Nova Senha*</label>
            <input
              type="password"
              id="novaSenha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="campo">
            <label htmlFor="confirmarSenha">Confirmar Nova Senha*</label>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" className="btn-salvar-senha" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlterarSenhaModal;