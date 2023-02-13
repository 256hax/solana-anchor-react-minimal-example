import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: false,
    host: true,
    // https: true, // Remove comment out this if use https.
  },
  plugins: [react()],
  // plugins: [react(), mkcert()], // Remove comment out this and above line if use https.
})
