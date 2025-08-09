import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cabecalho from './components/Cabecalho'
import TelaInicial from './pages/TelaInicial'
import CadastroClientes from './pages/CadastroClientes'
import CriaAuditoria from './components/CriaAuditoria'
import Auditorias from './pages/Auditorias'

function App() {
  return (
    <BrowserRouter>
      <Cabecalho />
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path='/auditorias' element={ <Auditorias />} />
        <Route path='/cadastro-clientes' element={ <CadastroClientes /> } />
        <Route path='/criar-auditoria' element={<CriaAuditoria />} />
        
        <Route path='/login' element={<h1>Página de Login</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
