import logo from '../assets/logo.png';
import '../styles/Cabecalho/index.css';

function Cabecalho() {
  return (
    <header className="cabecalho">
      <img src={logo} alt="Logo Consultech" className="logo" />
    </header>
  );
}

export default Cabecalho;