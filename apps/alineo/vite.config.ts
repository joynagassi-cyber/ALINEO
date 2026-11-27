import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

const appDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, appDirectory, '');
  const runtimePort = Number(environment.COPILOT_RUNTIME_PORT) || 8200;
  const copilotProxy = {
    '/api/copilotkit': {
      target: `http://127.0.0.1:${runtimePort}`,
      changeOrigin: false,
    },
  };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(appDirectory, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 4180,
      strictPort: true,
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
      proxy: copilotProxy,
    },
    preview: {
      host: '0.0.0.0',
      port: 4180,
      strictPort: true,
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
      proxy: copilotProxy,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      restoreMocks: true,
      exclude: [...configDefaults.exclude, 'dist-server/**'],
    },
  };
});
