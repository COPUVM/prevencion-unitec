import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {generateIcsFromQuery} from './src/utils/calendarFeed.ts';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'calendar-ics-dev-endpoint',
        configureServer(server) {
          server.middlewares.use('/api/calendar.ics', (req, res) => {
            const url = new URL(req.url || '/', 'http://localhost');
            const ics = generateIcsFromQuery(url.searchParams);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
            res.setHeader(
              'Content-Disposition',
              'inline; filename="plan_preventivo_unitec.ics"'
            );
            res.end(ics);
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
