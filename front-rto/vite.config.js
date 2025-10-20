import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 1.Permitindo acesso pela rede local (IPs)
    host: '0.0.0.0', 
    
    // 2. Adiciona seu domínio à lista de permissões
    allowedHosts: ['renatoft89.ddns.net'], 
  },
})