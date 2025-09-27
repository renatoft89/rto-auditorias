import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faListCheck,
  faUsersGear
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
        </div>
      </main>
    </div>
  );
};

export default Administracao;