import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig, loadEnv } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vite preview serves with the same `base` as production. Without this, opening
 * http://localhost:4173/ or http://localhost:4173/xiaowu_dev hits the wrong path
 * and Vite shows "did you mean /xiaowu_dev/?".
 */
function previewBaseRedirectPlugin(base: string): Plugin {
  const withSlash = base.endsWith('/') ? base : `${base}/`
  const trimmed = base.replace(/^\/+|\/+$/g, '')

  return {
    name: 'preview-base-redirect',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!trimmed) {
          next()
          return
        }
        const raw = req.url?.split('?')[0] ?? ''
        if (raw === '/' || raw === '') {
          res.statusCode = 302
          res.setHeader('Location', withSlash)
          res.end()
          return
        }
        if (raw === `/${trimmed}`) {
          res.statusCode = 302
          res.setHeader('Location', withSlash)
          res.end()
          return
        }
        next()
      })
    },
  }
}

// GitHub Pages project site: set VITE_BASE=/your-repo-name/ or edit fallback below.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE ?? '/xiaowu_dev/'

  return {
    base,
    plugins: [react(), tailwindcss(), previewBaseRedirectPlugin(base)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
