import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Cabecalho from './components/Cabecalho'
import TelaInicial from './pages/TelaInicial'
import CadastroClientes from './pages/CadastroClientes'
import CriaAuditoria from './components/CriaAuditoria'
import Auditorias from './pages/Auditorias'
import ListaAuditorias from './pages/ListaAuditorias';

function App() {
  return (
    <BrowserRouter>
      <Cabecalho />
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path='/auditorias' element={ <Auditorias />} />
        <Route path='/cadastro-clientes' element={ <CadastroClientes /> } />
        <Route path='/criar-auditoria' element={<CriaAuditoria />} />
        <Route path='/listar-auditorias' element={ <ListaAuditorias />} />
        
        <Route path='/login' element={<h1>Página de Login</h1>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
