import { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';
import '../styles/Cabecalho/index.css';

function Cabecalho() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null); // Estado para armazenar os dados do usuário
  const sidebarRef = useRef(null);

  // useEffect para carregar os dados do usuário quando o componente for montado
  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUsuarioLogado(userData);
      } catch (error) {
        console.error("Erro ao parsear os dados do usuário do localStorage:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Remover o item do localStorage ao fazer logout
    localStorage.removeItem('userData');
    setUsuarioLogado(null); // Limpar o estado do usuário
    console.log('Usuário deslogado!');
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="cabecalho">
      <div className="espacador"></div>
      
      <div className="logo-container">
        <img src={logo} alt="Logo Consultech" className="logo" />
      </div>
      
      <div className="perfil-usuario-container">
        {usuarioLogado ? ( // Renderização condicional
          <>
            <div className="perfil-usuario" onClick={toggleSidebar}>
              <FaUserCircle className="icone-usuario" />
              <span className="nome-usuario">{usuarioLogado.nome}</span>
              {sidebarOpen ? <FaTimes className="icone-toggle" /> : <FaBars className="icone-toggle" />}
            </div>

            <div ref={sidebarRef} className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
              <p className="sidebar-nome-usuario">Olá, {usuarioLogado.nome}</p>
              <button onClick={handleLogout} className="botao-logout">
                Logout
              </button>
            </div>
          </>
        ) : (
          <span className="nome-visitante">Visitante</span> // Exibe algo quando não há usuário logado
        )}
      </div>
    </header>
  );
}

export default Cabecalho;