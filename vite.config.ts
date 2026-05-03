import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** No-op when `base` is `/`; for subpath bases, preview redirects `/` to `base/`. */
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

// Host at site root (e.g. username.github.io).
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), previewBaseRedirectPlugin('/')],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
