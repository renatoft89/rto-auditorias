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
          <Link to="/administracao/topicos-perguntas" className="card-opcao">
            <FontAwesomeIcon icon={faListCheck} />
            <h3>Tópicos e Perguntas</h3>
            <p>Gerencie o modelo de auditorias e suas perguntas.</p>
          </Link>
          <Link to="/administracao/usuarios" className="card-opcao">
            <FontAwesomeIcon icon={faUsersGear} />
            <h3>Gerenciar Usuários</h3>
            <p>Gerencie os usuários e permissões do sistema.</p>
          </Link>
          <Link to="/administracao/clientes" className="card-opcao">
            <FontAwesomeIcon icon={faBuilding} />
            <h3>Gerenciar Clientes</h3>
            <p>Adicione, edite ou remova os clientes do sistema.</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Administracao;
