import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // 👈 Importe o hook do contexto

import '../styles/CabecalhoAuditoria/index.css';

const CabecalhoAuditoria = () => {
  const { userData } = useAuth(); // 👈 Obtém os dados do usuário logado
  const [auditoriaData, setAuditoriaData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('empresa-selecionada');
    if (savedData) {
      setAuditoriaData(JSON.parse(savedData));
    }
  }, []);

  // Adicione uma verificação para os dados do usuário também
  if (!auditoriaData || !userData) {
    return null;
  }

  const { cliente, auditoria } = auditoriaData;
  const dataFormatada = new Date(auditoria.dataInicio).toLocaleDateString('pt-BR');

  return (
    <div className="auditoria-header-info">
      <h1 className="cliente-nome">{cliente.razao_social}</h1>
      <p className="cliente-cnpj">
        <strong>CNPJ:</strong> {cliente.cnpj}
      </p>
      <hr className="divider" />
      <p>
        <strong>Tipo de Auditoria:</strong> {auditoria.tipoAuditoria}
      </p>
      <p>
        <strong>Auditor Responsável:</strong> {userData.nome}
      </p>
      <p>
        <strong>Data de Início:</strong> {dataFormatada}
      </p>
      <p>
        <strong>Observações:</strong> {auditoria.observacao_geral}
      </p>
    </div>
  );
};

export default CabecalhoAuditoria;