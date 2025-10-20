import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/CabecalhoAuditoria/index.css';
import { formatarData } from '../utils/formatarData'; // Importar função de formatação

// Recebe empresaInfo e auditoriaInfo como props
const CabecalhoAuditoria = ({ empresaInfo, auditoriaInfo }) => {
  const { userData } = useAuth();

  // Verifica se as props e userData existem
  if (!empresaInfo || !auditoriaInfo || !userData) {
    return null; // Ou um placeholder de carregamento se preferir
  }

  // Usa auditoriaInfo.dt_auditoria que vem da API
  const dataFormatada = auditoriaInfo.dt_auditoria
    ? formatarData(auditoriaInfo.dt_auditoria)
    : 'Data Inválida';

  // Usa auditoriaInfo.observacao que vem da API
  const observacaoGeral = auditoriaInfo.observacao || 'Nenhuma';
  // Usa empresaInfo.razao_social e cnpj que vêm da API
  const cliente = empresaInfo;
  // O tipo de auditoria não vem do backend atualmente, pode remover ou ajustar
  // const tipoAuditoria = auditoriaInfo.tipoAuditoria || 'Não especificado';

  return (
    <div className="auditoria-header-info">
      <h1 className="cliente-nome">{cliente.razao_social}</h1>
      <p className="cliente-cnpj">
        <strong>CNPJ:</strong> {cliente.cnpj}
      </p>
      <hr className="divider" />
      {/* <p>
        <strong>Tipo de Auditoria:</strong> {tipoAuditoria}
      </p> */}
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