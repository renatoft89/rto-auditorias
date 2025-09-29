import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListCheck,
  faUsersGear,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import PageCabecalho from '../components/Botoes/PageCabecalho';

import '../styles/Administracao/index.css';

const Administracao = () => {
  return (
    <div className="administracao-page">
      <PageCabecalho title="Administração do Sistema" backTo="/" />
      <main className="opcoes">
        <div className="botoes">

          {/* Opção 1: Gerenciar Tópicos e Perguntas */}
          <Link to="/administracao/topicos-perguntas" className="card-opcao">
            <FontAwesomeIcon icon={faListCheck} />
            <h3>Tópicos e Perguntas</h3>
            <p>Gerencie o modelo de auditorias e suas perguntas.</p>
          </Link>

          {/* Opção 2: Gerenciar Usuários */}
          <Link to="/administracao/usuarios" className="card-opcao">
            <FontAwesomeIcon icon={faUsersGear} />
            <h3>Gerenciar Usuários</h3>
            <p>Gerencie os usuários e permissões do sistema.</p>
          </Link>

          {/* Opção 1: Cadastrar Nova Empresa */}
          <Link to="/cadastro-clientes" className="card-opcao">
            <FontAwesomeIcon icon={faBuilding} />
            <h3>Cadastrar Empresa</h3>
            <p>Registre os dados da empresa que passará por auditoria.</p>
          </Link>

        </div>
      </main>
    </div>
  );
};

export default Administracao;