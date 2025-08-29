import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Cabecalho from "./components/Cabecalho";
import TelaInicial from "./pages/TelaInicial";
import CadastroClientes from "./pages/CadastroClientes";
import CriaAuditoria from "./components/CriaAuditoria";
import Auditorias from "./pages/Auditorias";
import ListaAuditorias from "./pages/ListaAuditorias";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";

// Componente de layout com cabeçalho
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
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutComCabecalho />}>
          <Route path="/" element={<TelaInicial />} />
          <Route path="/auditorias" element={<Auditorias />} />
          <Route path="/cadastro-clientes" element={<CadastroClientes />} />
          <Route path="/criar-auditoria" element={<CriaAuditoria />} />
          <Route path="/listar-auditorias" element={<ListaAuditorias />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
