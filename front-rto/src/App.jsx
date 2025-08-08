import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cabecalho from './components/Cabecalho'
import TelaInicial from './pages/TelaInicial'

function App() {
  return (
    <BrowserRouter>
      <Cabecalho />
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path='/login' element={<h1>Página de Login</h1>} />
        <Route path='/auditorias' element={<h1>Página Cadastro Usuários</h1>} />
        <Route path='/cadastro-clientes' element={<h1>Página Cadastro Clientes</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
