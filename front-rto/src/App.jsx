import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<h1>Página de Login</h1>} />
        <Route path='/register-user' element={<h1>Página Cadastro Usuários</h1>} />
        <Route path='/register-clients' element={<h1>Página Cadastro Clientes</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
