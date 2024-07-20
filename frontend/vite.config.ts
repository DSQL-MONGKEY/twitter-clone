import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   server: {
      port: 3000,
      proxy: {
         "/api" : {
            target: "https://twitter-backend-m7b6mm5b4a-as.a.run.app",
            changeOrigin: true,
         }
      }
   },
})
