import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import handler from './server/handler.js';

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  const middleware = (server) => { server.middlewares.use('/api', (req, res) => { req.url = req.originalUrl; handler(req, res); }); };
  return { plugins: [react(), { name: 'mumti-api', configureServer: middleware, configurePreviewServer: middleware }] };
});