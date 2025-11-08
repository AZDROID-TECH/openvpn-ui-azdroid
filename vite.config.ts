import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'

// DÜZƏLİŞ: __dirname ESM mühitində mövcud deyil, ona görə manual olaraq təyin edilir.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: [
                'electron',
                'electron-log',
                'keytar'
              ],
            },
          },
        },
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: {},
    }),
  ],
})
