import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))
const isDev = process.env.NODE_ENV === 'development'
const appVersion = isDev ? `${version}-Dev` : version

export default defineConfig({
  plugins: [react()],
  base: '/vocabTrainer/',
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
})
