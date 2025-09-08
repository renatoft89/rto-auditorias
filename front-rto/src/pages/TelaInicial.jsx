import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faFileCirclePlus,
  faMagnifyingGlass,
  faChartColumn,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import '../styles/TelaInicial/index.css';

const TelaInicial = () => {

  const usuario = JSON.parse(localStorage.getItem('userData'));

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
            <FontAwesomeIcon icon={faFileCirclePlus} />
            <h3>Criar Nova Auditoria</h3>
            <p>Selecione a empresa e o período da nova auditoria.</p>
          </Link>

          {/* Opção 3: Ver Auditorias */}
          <Link to="/listar-auditorias" className="card-opcao">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <h3>Consultar Auditorias</h3>
            <p>Consulte auditorias existentes</p>
          </Link>
          {/* Opção 4: Ver Relatorios */}
          <Link to="/resumo-rto" className="card-opcao">
            <FontAwesomeIcon icon={faChartColumn} />
            <h3>Relatórios</h3>
            <p>Veja os Relatórios Detalhados</p>
          </Link>
          {/* Opção 5: Criar Novo Usuario */}
          {usuario.role === 'ADM' && (
            <Link to="/cadastro-usuarios" className="card-opcao">
              <FontAwesomeIcon icon={faUserPlus} />
              <h3>Criar Usuário</h3>
              <p>Cadastre novos usuários no sistema</p>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default TelaInicial;