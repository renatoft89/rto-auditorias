import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Cabecalho from "./components/Cabecalho";
import TelaInicial from "./pages/TelaInicial";
import CadastroClientes from "./pages/CadastroClientes";
import CriaAuditoria from "./components/CriaAuditoria";
import Auditorias from "./pages/Auditorias";
import ListaAuditorias from "./pages/ListaAuditorias";
import Login from "./pages/Login";
import ResumoRto from "./pages/ResumoRto";
import CadastroUsuarios from "./pages/CadastroUsuarios";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";
import RotaPrivada from "./components/RotasPrivadas";
import AgendaAuditorias from "./pages/AgendaAuditorias";


function LayoutComCabecalho() {
  return (
    <>
      <Cabecalho />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={ <Login /> } />
          <Route element={ <RotaPrivada />}>
            <Route element={ <LayoutComCabecalho /> }>
              <Route path="/" element={ <TelaInicial /> } />
              <Route path="/auditorias" element={ <Auditorias /> } />
              <Route path="/cadastro-clientes" element={ <CadastroClientes /> } />
              <Route path="/cadastro-usuarios" element={ <CadastroUsuarios /> } />
              <Route path="/criar-auditoria" element={ <CriaAuditoria /> } />
              <Route path="/listar-auditorias" element={ <ListaAuditorias /> } />
              <Route path="/resumo-rto" element={ <ResumoRto />} />
              <Route path="/agenda-auditorias" element={ <AgendaAuditorias /> } />
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
