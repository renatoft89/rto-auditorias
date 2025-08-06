import { createContext, useContext, useState } from 'react'

// Criação do contexto
const AutenticacaoContext = createContext()

export function AutenticacaoProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  function login(email, senha) {
    // Aqui você pode integrar com uma API no futuro
    if (email && senha) {
      setUsuario({ email })
    }
  }

  function logout() {
    setUsuario(null)
  }

  return (
    <AutenticacaoContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AutenticacaoContext.Provider>
  )
}

// Hook personalizado
export function useAutenticacao() {
  return useContext(AutenticacaoContext)
}
