import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/CabecalhoAuditoria/index.css';
import { formatarData } from '../utils/formatarData'; // Importar função de formatação

const CabecalhoAuditoria = ({ empresaInfo, auditoriaInfo }) => {

  const { userData } = useAuth();

  if (!empresaInfo || !auditoriaInfo || !userData) {
    return null; // Ou um placeholder de carregamento se preferir
  }

  const dataFormatada = auditoriaInfo.dt_auditoria
    ? formatarData(auditoriaInfo.dt_auditoria)
    : 'Data Inválida';

  const observacaoGeral = auditoriaInfo.observacao || 'Nenhuma';
  const cliente = empresaInfo;


  return (
    <div className="auditoria-header-info">
      <h1 className="cliente-nome">{cliente.razao_social}</h1>
      <p className="cliente-cnpj">
        <strong>CNPJ:</strong> {cliente.cnpj}
      </p>
      <p>
        <strong>Responsável:</strong> {cliente.responsavel}
      </p>
      <p>
        <strong>Contato:</strong> {cliente.telefone}
      </p>
      <hr className="divider" />
      <p>
        <strong>Auditor Responsável:</strong> {userData.nome}
      </p>
      <p>
        <strong>Data da Auditoria:</strong> {dataFormatada}
      </p>
      <p>
        <strong>Observações Gerais:</strong> {observacaoGeral}
      </p>
    </div>
  );
};

export default CabecalhoAuditoria;