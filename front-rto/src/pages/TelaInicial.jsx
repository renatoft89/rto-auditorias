import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCalendarPlus, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import '../styles/TelaInicial/index.css';

const TelaInicial = () => {
  return (
    <div className="container">
      <main className="opcoes">
        <h2>O que você deseja fazer?</h2>

        <div className="botoes">
          {/* Opção 1: Cadastrar Nova Empresa */}
          <Link to="/cadastro-clientes" className="card-opcao">
            <FontAwesomeIcon icon={faBuilding} />
            <h3>Cadastrar Nova Empresa</h3>
            <p>Registre os dados da empresa que passará por auditoria.</p>
          </Link>

          {/* Opção 2: Criar Novo Ciclo de Formulários */}
          <Link to="/criar-auditoria" className="card-opcao">
            <FontAwesomeIcon icon={faCalendarPlus} />
            <h3>Criar Nova Auditoria</h3>
            <p>Selecione a empresa e o período da nova auditoria.</p>
          </Link>

          {/* Opção 3: Ver Auditorias Ativos
          <Link to="/lista-auditorias" className="card-opcao">
            <FontAwesomeIcon icon={faClipboardList} />
            <h3>Ver Auditorias Ativas</h3>
            <p>Consulte auditorias  existentes, continue preenchimentos ou veja o status.</p>
          </Link> */}
        </div>
      </main>
    </div>
  );
};

export default TelaInicial;