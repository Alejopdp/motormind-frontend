import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  base: '/motormind-frontend/' // Asegúrate de usar el nombre de tu repositorio aquí

})

